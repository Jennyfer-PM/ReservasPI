from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime, timedelta
import models, schemas
from database import SessionLocal, engine
import bcrypt

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Reservas UPQ", version="2.0.0")

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

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

@app.post("/api/login", status_code=status.HTTP_200_OK)
def login(datos: schemas.LoginRequest, db: Session = Depends(get_db)):
    query = text("""
        SELECT p.id, p.nombre, p.ap, p.am, p.correoi, p.telefono, p.clave,
               CASE 
                   WHEN a.id IS NOT NULL THEN 'alumno'
                   WHEN d.id IS NOT NULL THEN 'docente'
                   WHEN ad.id IS NOT NULL THEN 'administrador'
                   ELSE 'usuario'
               END as tipo
        FROM Personas p
        LEFT JOIN Alumnos a ON p.id = a.id_persona
        LEFT JOIN Docentes d ON p.id = d.id_persona
        LEFT JOIN Administradores ad ON p.id = ad.id_persona
        WHERE p.correoi = :correo
    """)
    
    usuario = db.execute(query, {"correo": datos.correo}).fetchone()
    
    if not usuario or not verify_password(datos.contrasena, usuario[6]):
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
        "telefono": usuario[5],
        "tipo": usuario[7]
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
    
    hashed_password = hash_password(datos.contrasena)
    
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
            "clave": hashed_password, 
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

@app.get("/api/espacios", response_model=List[schemas.EspacioResponse])
def leer_espacios(db: Session = Depends(get_db)):
    try:
        espacios = db.query(models.Espacio).filter(
            models.Espacio.id_estatus == 1
        ).all()
        
        result = []
        for esp in espacios:
            area = db.query(models.Area).filter(models.Area.id == esp.id_area).first()
            nombre_area = area.nombre if area else "General"
            
            result.append({
                "id": esp.id,
                "nombre": esp.nombre,
                "capacidad": esp.capacidad,
                "id_estatus": esp.id_estatus,
                "area": nombre_area,
                "tipo": nombre_area,
                "ubicacion": f"Edificio {nombre_area}" if area else "No especificada"
            })
        
        print(f"Espacios enviados: {len(result)}")
        if result:
            print(f"Ejemplo: {result[0]}")
        
        return result
    except Exception as e:
        print(f"Error en espacios: {e}")
        return []

@app.post("/api/reservas", status_code=status.HTTP_201_CREATED)
def crear_reserva(
    reserva: schemas.ReservaCreate,
    db: Session = Depends(get_db)
):
    """Crea una nueva reserva"""
    
    # Verificar que el espacio existe y está disponible
    query_espacio = text("""
        SELECT id, capacidad FROM espacios 
        WHERE id = :id_espacio AND id_estatus = 1
    """)
    espacio = db.execute(query_espacio, {"id_espacio": reserva.id_espacio}).fetchone()
    
    if not espacio:
        raise HTTPException(status_code=404, detail="Espacio no disponible")
    
    # Calcular fecha fin
    try:
        duracion_parts = reserva.duracion.split()
        horas = 0
        minutos = 0
        for i in range(0, len(duracion_parts), 2):
            if i+1 < len(duracion_parts):
                valor = int(duracion_parts[i])
                unidad = duracion_parts[i+1].lower()
                if 'hour' in unidad:
                    horas = valor
                elif 'minute' in unidad:
                    minutos = valor
        fecha_fin = reserva.fecha + timedelta(hours=horas, minutes=minutos)
    except:
        fecha_fin = reserva.fecha + timedelta(hours=1, minutes=30)
    
    # Verificar disponibilidad
    query_disponibilidad = text("""
        SELECT COUNT(*) FROM reservas 
        WHERE id_espacio = :id_espacio 
        AND fecha < :fecha_fin 
        AND (fecha + duracion) > :fecha_inicio
    """)
    count = db.execute(query_disponibilidad, {
        "id_espacio": reserva.id_espacio,
        "fecha_inicio": reserva.fecha,
        "fecha_fin": fecha_fin
    }).fetchone()[0]
    
    if count > 0:
        raise HTTPException(status_code=409, detail="El espacio no está disponible en ese horario")
    
    # Insertar reserva
    query_insert = text("""
        INSERT INTO reservas (
            id_docente, nombre, id_espacio, fecha, duracion, 
            id_servicio, detalles, id_estatus
        ) VALUES (
            :id_docente, :nombre, :id_espacio, :fecha, :duracion,
            :id_servicio, :detalles, 3
        )
        RETURNING id
    """)
    
    try:
        result = db.execute(query_insert, {
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

@app.post("/api/solicitudes", status_code=status.HTTP_201_CREATED)
def crear_solicitud(
    id_alumno: int,
    id_reserva: int,
    db: Session = Depends(get_db)
):
    # Verificar que el alumno existe
    query_alumno = text("SELECT id FROM Alumnos WHERE id = :id")
    alumno = db.execute(query_alumno, {"id": id_alumno}).fetchone()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    # Verificar que la reserva existe
    query_reserva = text("SELECT id FROM Reservas WHERE id = :id")
    reserva = db.execute(query_reserva, {"id": id_reserva}).fetchone()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    
    # Verificar si ya existe una solicitud
    query_existente = text("""
        SELECT id FROM Solicitudes 
        WHERE id_alumno = :id_alumno AND id_reserva = :id_reserva
    """)
    existente = db.execute(query_existente, {
        "id_alumno": id_alumno,
        "id_reserva": id_reserva
    }).fetchone()
    
    if existente:
        raise HTTPException(status_code=400, detail="Ya has solicitado esta reserva")
    
    # Crear solicitud
    query_solicitud = text("""
        INSERT INTO Solicitudes (id_alumno, id_reserva, id_estatus)
        VALUES (:id_alumno, :id_reserva, 3)
        RETURNING id
    """)
    
    try:
        result = db.execute(query_solicitud, {
            "id_alumno": id_alumno,
            "id_reserva": id_reserva
        })
        db.commit()
        
        return {
            "status": "success",
            "message": "Solicitud creada exitosamente",
            "id_solicitud": result.fetchone()[0]
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al crear solicitud: {str(e)}"
        )

@app.get("/api/reservas")
def obtener_reservas(
    usuario_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    if usuario_id:
        query = text("""
            SELECT 
                s.id, 
                e.nombre as espacio_nombre, 
                r.nombre as proposito, 
                r.fecha, 
                r.duracion,
                est.descripcion as estado,
                p.nombre as alumno,
                r.id as id_reserva
            FROM Solicitudes s
            INNER JOIN Reservas r ON s.id_reserva = r.id
            INNER JOIN Espacios e ON r.id_espacio = e.id
            INNER JOIN Estatus est ON s.id_estatus = est.id
            INNER JOIN Alumnos a ON s.id_alumno = a.id
            INNER JOIN Personas p ON a.id_persona = p.id
            WHERE a.id_persona = :usuario_id
            ORDER BY r.fecha DESC
        """)
        result = db.execute(query, {"usuario_id": usuario_id}).fetchall()
    else:
        query = text("""
            SELECT 
                s.id, 
                e.nombre as espacio_nombre, 
                r.nombre as proposito, 
                r.fecha, 
                r.duracion,
                est.descripcion as estado,
                p.nombre as alumno,
                r.id as id_reserva
            FROM Solicitudes s
            INNER JOIN Reservas r ON s.id_reserva = r.id
            INNER JOIN Espacios e ON r.id_espacio = e.id
            INNER JOIN Estatus est ON s.id_estatus = est.id
            INNER JOIN Alumnos a ON s.id_alumno = a.id
            INNER JOIN Personas p ON a.id_persona = p.id
            ORDER BY r.fecha DESC
            LIMIT 50
        """)
        result = db.execute(query).fetchall()
    
    return [
        {
            "id": row[0],
            "espacio_nombre": row[1],
            "proposito": row[2],
            "fecha": row[3].strftime("%Y-%m-%d %H:%M") if row[3] else "N/A",
            "duracion": str(row[4]),
            "estado": row[5],
            "alumno": row[6],
            "id_reserva": row[7]
        } for row in result
    ]

@app.get("/api/reservas/usuario/{usuario_id}")
def obtener_historial_especifico(
    usuario_id: int, 
    mes: Optional[int] = None,
    anio: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT 
            r.id as id_reserva,
            r.nombre as nombre_evento, 
            e.nombre as nombre_espacio, 
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
    else:
        query = text(str(query) + " ORDER BY r.fecha DESC")
    
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
            COUNT(s.id) as total,
            SUM(CASE WHEN est.descripcion = 'Autorizada' THEN 1 ELSE 0 END) as aprobadas
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
            SET id_carrera = (SELECT id FROM Carreras WHERE nombre ILIKE :carrera LIMIT 1)
            WHERE id_persona = :id
        """)
        try:
            db.execute(query_carrera, {"carrera": f"%{datos.carrera}%", "id": datos.id_persona})
        except Exception as e:
            print(f"Error actualizando carrera: {e}")
    
    if datos.contrasena:
        hashed = hash_password(datos.contrasena)
        update_fields.append('clave = :contrasena')
        params['contrasena'] = hashed
    
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
        query = text("SELECT id, nombre, siglas FROM Carreras ORDER BY nombre")
        result = db.execute(query).fetchall()
        return [{"id": row[0], "nombre": row[1], "siglas": row[2]} for row in result]
    except Exception as e:
        print(f"Error al obtener carreras: {e}")
        return []

@app.get("/api/usuario/alumno/{usuario_id}")
def obtener_alumno_por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """Obtiene el ID del alumno a partir del ID de persona"""
    query = text("""
        SELECT a.id FROM alumnos a
        WHERE a.id_persona = :usuario_id
    """)
    result = db.execute(query, {"usuario_id": usuario_id}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Alumno no encontrado para este usuario")
    
    return {"id": result[0]}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }