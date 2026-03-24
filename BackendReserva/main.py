from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime, timedelta
import models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Reservas UPQ", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/login", status_code=status.HTTP_200_OK)
def login(datos: schemas.LoginRequest, db: Session = Depends(get_db)):
    query = text("""
        SELECT id, nombre, ap, am, correoi, telefono
        FROM Personas 
        WHERE correoi = :correo AND clave = :clave
    """)
    usuario = db.execute(query, {
        "correo": datos.correo, 
        "clave": datos.contrasena
    }).fetchone()
    
    if not usuario:
        raise HTTPException(
            status_code=401, 
            detail="Correo o contraseña incorrectos"
        )
    
    nombre_completo = f"{usuario[1]} {usuario[2]} {usuario[3]}" if usuario[3] else f"{usuario[1]} {usuario[2]}"
    
    return {
        "status": "success", 
        "usuario": nombre_completo,
        "id": usuario[0],
        "email": usuario[4],
        "telefono": usuario[5]
    }

@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def registrar_usuario(datos: schemas.RegistroCompletoRequest, db: Session = Depends(get_db)):
    if not datos.correo.lower().endswith("@upq.edu.mx"):
        raise HTTPException(
            status_code=400, 
            detail="Solo se permiten registros con correo institucional @upq.edu.mx"
        )
    
    check_query = text('SELECT id FROM Personas WHERE correoi = :correo')
    existing = db.execute(check_query, {"correo": datos.correo}).fetchone()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="El correo ya está registrado"
        )
    
    query_persona = text("""
        INSERT INTO Personas (nombre, ap, am, edad, correoi, clave, telefono, id_estatus)
        VALUES (:nombre, :ap, :am, :edad, :correo, :clave, :telefono, 1)
        RETURNING id
    """)
    
    try:
        result = db.execute(query_persona, {
            "nombre": datos.nombre, 
            "ap": datos.ap, 
            "am": datos.am, 
            "edad": datos.edad, 
            "correo": datos.correo, 
            "clave": datos.contrasena, 
            "telefono": datos.telefono or ""
        })
        db.commit()
        persona_id = result.fetchone()[0]
        
        if datos.tipo_usuario == 'alumno':
            if not datos.matricula or not datos.curp or not datos.id_carrera or not datos.cuatrimestre:
                raise HTTPException(
                    status_code=400,
                    detail="Faltan campos obligatorios para alumno"
                )
            
            query_alumno = text("""
                INSERT INTO Alumnos (matricula, id_persona, curp, id_carrera, cuatrimestre)
                VALUES (:matricula, :id_persona, :curp, :id_carrera, :cuatrimestre)
            """)
            db.execute(query_alumno, {
                "matricula": datos.matricula,
                "id_persona": persona_id,
                "curp": datos.curp.upper(),
                "id_carrera": datos.id_carrera,
                "cuatrimestre": datos.cuatrimestre
            })
            
        elif datos.tipo_usuario == 'docente':
            if not datos.no_empleado:
                raise HTTPException(
                    status_code=400,
                    detail="Faltan campos obligatorios para docente"
                )
            
            query_docente = text("""
                INSERT INTO Docentes (noEmpleado, id_persona, rfc, id_area)
                VALUES (:no_empleado, :id_persona, :rfc, 1)
            """)
            db.execute(query_docente, {
                "no_empleado": datos.no_empleado,
                "id_persona": persona_id,
                "rfc": datos.rfc or ""
            })
        
        db.commit()
        
        return {
            "status": "success", 
            "message": "Usuario registrado exitosamente",
            "id": persona_id,
            "tipo": datos.tipo_usuario
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error en registro: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error al registrar usuario: {str(e)}"
        )

@app.get("/api/espacios", response_model=List[schemas.EspacioBase])
def leer_espacios(db: Session = Depends(get_db)):
    try:
        espacios = db.query(models.Espacio).filter(
            models.Espacio.id_estatus == 1
        ).all()
        
        result = []
        for esp in espacios:
            area = db.query(models.Area).filter(models.Area.id == esp.id_area).first()
            result.append({
                "id": esp.id,
                "nombre": esp.nombre,
                "capacidad": esp.capacidad,
                "id_estatus": esp.id_estatus,
                "area": area.nombre if area else "Sin área",
                "tipo": area.nombre if area else "General",
                "ubicacion": f"Edificio {area.nombre}" if area else "No especificada"
            })
        
        return result
    except Exception as e:
        print(f"Error en espacios: {e}")
        return []
    
@app.get("/api/espacios_raw")
def leer_espacios_raw(db: Session = Depends(get_db)):
    try:
        espacios = db.query(models.Espacio).all()
        return [
            {
                "id": e.id,
                "nombre": e.nombre,
                "capacidad": e.capacidad,
                "id_area": e.id_area,
                "id_estatus": e.id_estatus
            } for e in espacios
        ]
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/reservas", status_code=status.HTTP_201_CREATED)
def crear_reserva(reserva: schemas.ReservaCreate, db: Session = Depends(get_db)):
    espacio = db.query(models.Espacio).filter(
        models.Espacio.id == reserva.id_espacio,
        models.Espacio.id_estatus == 1
    ).first()
    
    if not espacio:
        raise HTTPException(
            status_code=404, 
            detail="Espacio no encontrado o no disponible"
        )
    
    query_disponibilidad = text("""
        SELECT COUNT(*) 
        FROM Reservas 
        WHERE id_espacio = :id_espacio 
        AND fecha BETWEEN :fecha_inicio AND :fecha_fin
    """)
    
    fecha_fin = reserva.fecha + timedelta(hours=reserva.duracion)
    
    count = db.execute(query_disponibilidad, {
        "id_espacio": reserva.id_espacio,
        "fecha_inicio": reserva.fecha,
        "fecha_fin": fecha_fin
    }).fetchone()[0]
    
    if count > 0:
        raise HTTPException(
            status_code=409,
            detail="El espacio no está disponible en ese horario"
        )
    
    query_reserva = text("""
        INSERT INTO Reservas (
            id_docente, nombre, id_espacio, fecha, duracion, 
            id_servicio, detalles, id_estatus
        ) VALUES (
            :id_docente, :nombre, :id_espacio, :fecha, :duracion,
            :id_servicio, :detalles, 1
        )
        RETURNING id
    """)
    
    try:
        result = db.execute(query_reserva, {
            "id_docente": reserva.id_docente,
            "nombre": reserva.nombre,
            "id_espacio": reserva.id_espacio,
            "fecha": reserva.fecha,
            "duracion": reserva.duracion,
            "id_servicio": reserva.id_servicio,
            "detalles": reserva.detalles
        })
        db.commit()
        reserva_id = result.fetchone()[0]
        
        return {
            "status": "success",
            "message": "Reserva creada exitosamente",
            "id_reserva": reserva_id
        }
    except Exception as e:
        db.rollback()
        print(f"Error al crear reserva: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al crear reserva: {str(e)}"
        )

@app.get("/api/reservas")
def obtener_reservas(db: Session = Depends(get_db)):
    query = text("""
        SELECT 
            s.id, 
            e.nombre as espacio, 
            r.nombre as reserva, 
            r.fecha, 
            est.descripcion as estado,
            p.nombre as alumno
        FROM Solicitudes s
        INNER JOIN Reservas r ON s.id_reserva = r.id
        INNER JOIN Espacios e ON r.id_espacio = e.id
        INNER JOIN Estatus est ON s.id_estatus = est.id
        INNER JOIN Alumnos a ON s.id_alumno = a.id
        INNER JOIN Personas p ON a.id_persona = p.id
        ORDER BY r.fecha DESC
    """)
    try:
        result = db.execute(query).fetchall()
        return [
            {
                "id": row[0],
                "espacio_nombre": row[1],
                "proposito": row[2],
                "fecha": str(row[3]),
                "estado": row[4],
                "alumno": row[5]
            } for row in result
        ]
    except Exception as e:
        print(f"Error en Reservas: {e}")
        return []

@app.get("/api/reservas/usuario/{usuario_id}")
def obtener_historial_especifico(
    usuario_id: int, 
    mes: Optional[int] = None,
    anio: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT 
            s.id, 
            r.nombre as reserva, 
            e.nombre as espacio, 
            r.fecha, 
            r.duracion, 
            est.descripcion as estado
        FROM Solicitudes s
        INNER JOIN Alumnos a ON s.id_alumno = a.id
        INNER JOIN Reservas r ON s.id_reserva = r.id
        INNER JOIN Espacios e ON r.id_espacio = e.id
        INNER JOIN Estatus est ON s.id_estatus = est.id
        WHERE a.id_persona = :id
    """)
    
    params = {"id": usuario_id}
    
    if mes and anio:
        query = text(str(query) + """
            AND EXTRACT(MONTH FROM r.fecha) = :mes 
            AND EXTRACT(YEAR FROM r.fecha) = :anio
            ORDER BY r.fecha DESC
        """)
        params.update({"mes": mes, "anio": anio})
    
    try:
        result = db.execute(query, params).fetchall()
        return [
            {
                "id_reserva": row[0],
                "nombre_evento": row[1],
                "nombre_espacio": row[2],
                "fecha": row[3].strftime("%d de %B, %Y") if row[3] else "N/A",
                "hora_inicio": row[3].strftime("%H:%M") if row[3] else "N/A",
                "duracion": str(row[4]),
                "estado": row[5]
            } for row in result
        ]
    except Exception as e:
        print(f"Error en Historial: {e}")
        return []

@app.get("/api/usuario/{usuario_id}")
def obtener_perfil_usuario(usuario_id: int, db: Session = Depends(get_db)):
    query_usuario = text("""
        SELECT p.nombre, p.ap, p.am, p.correoi, p.telefono, c.nombre as carrera
        FROM Personas p
        LEFT JOIN Alumnos a ON p.id = a.id_persona
        LEFT JOIN Carreras c ON a.id_carrera = c.id
        WHERE p.id = :id
    """)
    user = db.execute(query_usuario, {"id": usuario_id}).fetchone()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    query_stats = text("""
        SELECT 
            COUNT(s.id), 
            SUM(CASE WHEN est.descripcion = 'Aprobada' THEN 1 ELSE 0 END)
        FROM Alumnos a
        LEFT JOIN Solicitudes s ON a.id = s.id_alumno
        LEFT JOIN Estatus est ON s.id_estatus = est.id
        WHERE a.id_persona = :id
    """)
    stats = db.execute(query_stats, {"id": usuario_id}).fetchone()
    
    nombre_completo = f"{user[0]} {user[1]} {user[2]}" if user[2] else f"{user[0]} {user[1]}"
    
    return {
        "nombre": nombre_completo,
        "puesto": "Alumno UPQ",
        "carrera": user[5] or "No asignada",
        "email": user[3],
        "telefono": user[4] or "No registrado",
        "miembroDesde": "2024",
        "totales": stats[0] if stats and stats[0] else 0,
        "aprobadas": stats[1] if stats and stats[1] else 0
    }

@app.put("/api/usuario/actualizar")
def actualizar_usuario(
    datos: schemas.UsuarioUpdateRequest,
    db: Session = Depends(get_db)
):
    update_fields = []
    params = {"id": datos.id_persona}
    
    if datos.telefono:
        update_fields.append('telefono = :telefono')
        params['telefono'] = datos.telefono
    
    if datos.carrera:
        query_carrera = text("""
            UPDATE Alumnos 
            SET id_carrera = (SELECT id FROM Carreras WHERE nombre = :carrera)
            WHERE id_persona = :id
        """)
        try:
            db.execute(query_carrera, {"carrera": datos.carrera, "id": datos.id_persona})
        except:
            pass
    
    if datos.contrasena:
        update_fields.append('clave = :contrasena')
        params['contrasena'] = datos.contrasena
    
    if update_fields:
        query = text(f"""
            UPDATE Personas 
            SET {', '.join(update_fields)}
            WHERE id = :id
        """)
        try:
            db.execute(query, params)
            db.commit()
            return {"status": "success", "message": "Perfil actualizado"}
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error al actualizar: {str(e)}"
            )
    
    return {"status": "info", "message": "No se realizaron cambios"}

@app.get("/api/carreras")
def obtener_carreras(db: Session = Depends(get_db)):
    try:
        query = text("SELECT id, nombre FROM Carreras ORDER BY nombre")
        result = db.execute(query).fetchall()
        return [{"id": row[0], "nombre": row[1]} for row in result]
    except Exception as e:
        print(f"Error al obtener carreras: {e}")
        return []

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }