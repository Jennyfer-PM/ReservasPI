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

# ============================================
# ENDPOINTS DE AUTENTICACIÓN
# ============================================

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

# ============================================
# ENDPOINTS DE ESPACIOS
# ============================================

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

# ============================================
# ENDPOINTS DE RESERVAS - CORREGIDO
# ============================================

@app.post("/api/reservas", status_code=status.HTTP_201_CREATED)
def crear_reserva(
    reserva: schemas.ReservaCreate,
    db: Session = Depends(get_db)
):
    """Crea una nueva reserva"""
    
    query_espacio = text("""
        SELECT id, capacidad FROM espacios 
        WHERE id = :id_espacio AND id_estatus = 1
    """)
    espacio = db.execute(query_espacio, {"id_espacio": reserva.id_espacio}).fetchone()
    
    if not espacio:
        raise HTTPException(status_code=404, detail="Espacio no disponible")
    
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

@app.get("/api/reservas")
def obtener_reservas(
    usuario_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Obtiene todas las reservas (tanto de alumnos como de docentes)"""
    
    if usuario_id:
        # Para un usuario específico (alumno o docente)
        query = text("""
            SELECT 
                r.id,
                e.nombre as espacio_nombre, 
                r.nombre as proposito, 
                r.fecha, 
                r.duracion,
                est.descripcion as estado,
                COALESCE(p_alumno.nombre, p_docente.nombre, 'Desconocido') as solicitante,
                r.id as id_reserva
            FROM reservas r
            INNER JOIN espacios e ON r.id_espacio = e.id
            INNER JOIN estatus est ON r.id_estatus = est.id
            LEFT JOIN solicitudes s ON r.id = s.id_reserva
            LEFT JOIN alumnos a ON s.id_alumno = a.id
            LEFT JOIN personas p_alumno ON a.id_persona = p_alumno.id
            LEFT JOIN docentes d ON r.id_docente = d.id
            LEFT JOIN personas p_docente ON d.id_persona = p_docente.id
            WHERE p_alumno.id = :usuario_id OR p_docente.id = :usuario_id
            ORDER BY r.fecha DESC
        """)
        result = db.execute(query, {"usuario_id": usuario_id}).fetchall()
    else:
        # Para todos (admin)
        query = text("""
            SELECT 
                r.id,
                e.nombre as espacio_nombre, 
                r.nombre as proposito, 
                r.fecha, 
                r.duracion,
                est.descripcion as estado,
                COALESCE(p_alumno.nombre, p_docente.nombre, 'Desconocido') as solicitante,
                r.id as id_reserva
            FROM reservas r
            INNER JOIN espacios e ON r.id_espacio = e.id
            INNER JOIN estatus est ON r.id_estatus = est.id
            LEFT JOIN solicitudes s ON r.id = s.id_reserva
            LEFT JOIN alumnos a ON s.id_alumno = a.id
            LEFT JOIN personas p_alumno ON a.id_persona = p_alumno.id
            LEFT JOIN docentes d ON r.id_docente = d.id
            LEFT JOIN personas p_docente ON d.id_persona = p_docente.id
            ORDER BY r.fecha DESC
            LIMIT 100
        """)
        result = db.execute(query).fetchall()
    
    reservas_list = []
    for row in result:
        fecha_str = row[3].strftime("%Y-%m-%d %H:%M") if row[3] else "N/A"
        reservas_list.append({
            "id": row[0],
            "espacio_nombre": row[1],
            "proposito": row[2],
            "fecha": fecha_str,
            "duracion": str(row[4]),
            "estado": row[5],
            "alumno": row[6],
            "id_reserva": row[7]
        })
    
    return reservas_list

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

# ============================================
# ENDPOINTS DE SOLICITUDES
# ============================================

@app.post("/api/solicitudes", status_code=status.HTTP_201_CREATED)
def crear_solicitud(
    id_alumno: int,
    id_reserva: int,
    db: Session = Depends(get_db)
):
    query_alumno = text("SELECT id FROM Alumnos WHERE id = :id")
    alumno = db.execute(query_alumno, {"id": id_alumno}).fetchone()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    query_reserva = text("SELECT id FROM Reservas WHERE id = :id")
    reserva = db.execute(query_reserva, {"id": id_reserva}).fetchone()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    
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

@app.put("/api/solicitudes/actualizar")
def actualizar_solicitud(
    id_alumno: int,
    id_reserva: int,
    id_estatus: int,
    db: Session = Depends(get_db)
):
    query = text("""
        UPDATE solicitudes 
        SET id_estatus = :id_estatus
        WHERE id_alumno = :id_alumno AND id_reserva = :id_reserva
        RETURNING id
    """)
    
    result = db.execute(query, {
        "id_alumno": id_alumno,
        "id_reserva": id_reserva,
        "id_estatus": id_estatus
    })
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    
    return {"status": "success", "message": "Solicitud actualizada"}

# ============================================
# ENDPOINTS DE USUARIO
# ============================================

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
    query = text("""
        SELECT a.id FROM alumnos a
        WHERE a.id_persona = :usuario_id
    """)
    result = db.execute(query, {"usuario_id": usuario_id}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Alumno no encontrado para este usuario")
    
    return {"id": result[0]}

@app.put("/api/reservas/{reserva_id}/aprobar")
def aprobar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    query_reserva = text("""
        SELECT id, id_espacio, fecha, duracion FROM reservas WHERE id = :id
    """)
    reserva = db.execute(query_reserva, {"id": reserva_id}).fetchone()
    
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    
    duracion_str = str(reserva[3])
    duracion_parts = duracion_str.split(':')
    horas = int(duracion_parts[0]) if len(duracion_parts) > 0 else 0
    minutos = int(duracion_parts[1]) if len(duracion_parts) > 1 else 0
    fecha_fin = reserva[2] + timedelta(hours=horas, minutes=minutos)
    
    query_verificar = text("""
        SELECT COUNT(*) FROM reservas 
        WHERE id_espacio = :id_espacio 
        AND id != :id_reserva
        AND fecha < :fecha_fin 
        AND (fecha + duracion) > :fecha_inicio
        AND id_estatus = 4
    """)
    count = db.execute(query_verificar, {
        "id_espacio": reserva[1],
        "id_reserva": reserva_id,
        "fecha_inicio": reserva[2],
        "fecha_fin": fecha_fin
    }).fetchone()[0]
    
    if count > 0:
        raise HTTPException(status_code=409, detail="El espacio ya está reservado en ese horario")
    
    query_update = text("UPDATE Solicitudes SET id_estatus = 4 WHERE id_reserva = :id")
    db.execute(query_update, {"id": reserva_id})
    query_update_reserva = text("UPDATE Reservas SET id_estatus = 4 WHERE id = :id")
    db.execute(query_update_reserva, {"id": reserva_id})
    db.commit()
    
    return {"status": "success", "message": "Reserva aprobada"}

@app.put("/api/reservas/{reserva_id}/rechazar")
def rechazar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    query_update = text("UPDATE Solicitudes SET id_estatus = 5 WHERE id_reserva = :id")
    db.execute(query_update, {"id": reserva_id})
    query_update_reserva = text("UPDATE Reservas SET id_estatus = 5 WHERE id = :id")
    db.execute(query_update_reserva, {"id": reserva_id})
    db.commit()
    return {"status": "success", "message": "Reserva rechazada"}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

# ============================================
# ENDPOINTS PARA DOCENTES
# ============================================

@app.get("/api/usuario/docente/{usuario_id}")
def obtener_docente_por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT d.id FROM docentes d
        WHERE d.id_persona = :usuario_id
    """)
    result = db.execute(query, {"usuario_id": usuario_id}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Docente no encontrado para este usuario")
    
    return {"id": result[0]}

@app.get("/api/docente/talleres/{docente_id}")
def obtener_talleres_docente(docente_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT r.id, r.nombre as titulo, e.nombre as lugar, 
               r.fecha, r.duracion, r.id_estatus as estado_id,
               est.descripcion as estado, 
               (SELECT COUNT(*) FROM solicitudes s WHERE s.id_reserva = r.id) as inscritos,
               e.capacidad
        FROM reservas r
        INNER JOIN espacios e ON r.id_espacio = e.id
        INNER JOIN estatus est ON r.id_estatus = est.id
        WHERE r.id_docente = :docente_id
        ORDER BY r.fecha DESC
    """)
    result = db.execute(query, {"docente_id": docente_id}).fetchall()
    
    talleres = []
    for row in result:
        duracion_str = str(row[4]) if row[4] else "0:00:00"
        try:
            duracion_parts = duracion_str.split(':')
            horas = int(duracion_parts[0])
            minutos = int(duracion_parts[1])
            fecha_inicio = row[3]
            fecha_fin = fecha_inicio + timedelta(hours=horas, minutes=minutos)
            hora_inicio = fecha_inicio.strftime("%H:%M")
            hora_fin = fecha_fin.strftime("%H:%M")
        except:
            hora_inicio = "00:00"
            hora_fin = "00:00"
        
        talleres.append({
            "id": row[0],
            "titulo": row[1],
            "lugar": row[2],
            "fecha": row[3].strftime("%Y-%m-%d") if row[3] else None,
            "horaInicio": hora_inicio,
            "horaFin": hora_fin,
            "estado": row[6],
            "estado_id": row[5],
            "inscritos": row[7] or 0,
            "capacidad": row[8]
        })
    
    return talleres

@app.get("/api/docente/estadisticas/{docente_id}")
def obtener_estadisticas_docente(docente_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT 
            COUNT(r.id) as total_talleres,
            COALESCE(SUM(s.inscritos), 0) as total_inscritos
        FROM reservas r
        LEFT JOIN (
            SELECT id_reserva, COUNT(*) as inscritos
            FROM solicitudes
            GROUP BY id_reserva
        ) s ON r.id = s.id_reserva
        WHERE r.id_docente = :docente_id
    """)
    result = db.execute(query, {"docente_id": docente_id}).fetchone()
    
    query_pendientes = text("""
        SELECT COUNT(*) 
        FROM solicitudes s
        INNER JOIN reservas r ON s.id_reserva = r.id
        WHERE r.id_docente = :docente_id AND s.id_estatus = 3
    """)
    pendientes = db.execute(query_pendientes, {"docente_id": docente_id}).fetchone()
    
    return {
        "totalTalleres": result[0] or 0,
        "totalInscritos": result[1] or 0,
        "pendientes": pendientes[0] or 0
    }

@app.get("/api/docente/taller/{taller_id}/inscritos")
def obtener_inscritos_taller(taller_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT a.id, p.nombre, p.ap, p.am, a.matricula, p.correoi as email,
               est.descripcion as estado_solicitud
        FROM solicitudes s
        INNER JOIN alumnos a ON s.id_alumno = a.id
        INNER JOIN personas p ON a.id_persona = p.id
        INNER JOIN estatus est ON s.id_estatus = est.id
        WHERE s.id_reserva = :taller_id
        ORDER BY p.nombre ASC
    """)
    result = db.execute(query, {"taller_id": taller_id}).fetchall()
    
    inscritos = []
    for row in result:
        nombre_completo = f"{row[1]} {row[2]} {row[3]}" if row[3] else f"{row[1]} {row[2]}"
        inscritos.append({
            "id": row[0],
            "nombre": nombre_completo,
            "matricula": row[4],
            "email": row[5],
            "estado": row[6]
        })
    
    return inscritos

@app.post("/api/docente/taller/crear")
def crear_taller(
    id_docente: int,
    nombre: str,
    id_espacio: int,
    fecha: str,
    hora_inicio: str,
    duracion_horas: int,
    duracion_minutos: int,
    detalles: str = None,
    db: Session = Depends(get_db)
):
    fecha_hora = datetime.strptime(f"{fecha} {hora_inicio}", "%Y-%m-%d %H:%M")
    duracion = f"{duracion_horas} hour {duracion_minutos} minutes"
    fecha_fin = fecha_hora + timedelta(hours=duracion_horas, minutes=duracion_minutos)
    
    query_disponibilidad = text("""
        SELECT COUNT(*) FROM reservas 
        WHERE id_espacio = :id_espacio 
        AND fecha < :fecha_fin 
        AND (fecha + duracion) > :fecha_inicio
    """)
    count = db.execute(query_disponibilidad, {
        "id_espacio": id_espacio,
        "fecha_inicio": fecha_hora,
        "fecha_fin": fecha_fin
    }).fetchone()[0]
    
    if count > 0:
        raise HTTPException(status_code=409, detail="El espacio no está disponible en ese horario")
    
    query_insert = text("""
        INSERT INTO reservas (
            id_docente, nombre, id_espacio, fecha, duracion, 
            id_servicio, detalles, id_estatus
        ) VALUES (
            :id_docente, :nombre, :id_espacio, :fecha, :duracion,
            2, :detalles, 3
        )
        RETURNING id
    """)
    
    try:
        result = db.execute(query_insert, {
            "id_docente": id_docente,
            "nombre": nombre,
            "id_espacio": id_espacio,
            "fecha": fecha_hora,
            "duracion": duracion,
            "detalles": detalles
        })
        db.commit()
        taller_id = result.fetchone()[0]
        
        return {
            "status": "success",
            "message": "Taller creado exitosamente",
            "id_taller": taller_id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear taller: {str(e)}")

@app.delete("/api/docente/taller/{taller_id}")
def eliminar_taller(taller_id: int, db: Session = Depends(get_db)):
    query_delete_solicitudes = text("DELETE FROM solicitudes WHERE id_reserva = :taller_id")
    db.execute(query_delete_solicitudes, {"taller_id": taller_id})
    
    query_delete_reserva = text("DELETE FROM reservas WHERE id = :taller_id")
    result = db.execute(query_delete_reserva, {"taller_id": taller_id})
    
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Taller no encontrado")
    
    return {"status": "success", "message": "Taller eliminado exitosamente"}

@app.put("/api/docente/taller/actualizar")
def actualizar_taller(
    id_taller: int,
    id_docente: int,
    nombre: str,
    id_espacio: int,
    fecha: str,
    hora_inicio: str,
    duracion_horas: int,
    duracion_minutos: int,
    detalles: str = None,
    db: Session = Depends(get_db)
):
    fecha_hora = datetime.strptime(f"{fecha} {hora_inicio}", "%Y-%m-%d %H:%M")
    duracion = f"{duracion_horas} hour {duracion_minutos} minutes"
    
    query_verificar = text("""
        SELECT id FROM reservas 
        WHERE id = :id_taller AND id_docente = :id_docente
    """)
    taller = db.execute(query_verificar, {
        "id_taller": id_taller,
        "id_docente": id_docente
    }).fetchone()
    
    if not taller:
        raise HTTPException(status_code=404, detail="Taller no encontrado o no pertenece al docente")
    
    fecha_fin = fecha_hora + timedelta(hours=duracion_horas, minutes=duracion_minutos)
    
    query_disponibilidad = text("""
        SELECT COUNT(*) FROM reservas 
        WHERE id_espacio = :id_espacio 
        AND id != :id_taller
        AND fecha < :fecha_fin 
        AND (fecha + duracion) > :fecha_inicio
    """)
    count = db.execute(query_disponibilidad, {
        "id_espacio": id_espacio,
        "id_taller": id_taller,
        "fecha_inicio": fecha_hora,
        "fecha_fin": fecha_fin
    }).fetchone()[0]
    
    if count > 0:
        raise HTTPException(status_code=409, detail="El espacio no está disponible en ese horario")
    
    query_update = text("""
        UPDATE reservas 
        SET nombre = :nombre, 
            id_espacio = :id_espacio, 
            fecha = :fecha, 
            duracion = :duracion,
            detalles = :detalles
        WHERE id = :id_taller
    """)
    
    try:
        db.execute(query_update, {
            "id_taller": id_taller,
            "nombre": nombre,
            "id_espacio": id_espacio,
            "fecha": fecha_hora,
            "duracion": duracion,
            "detalles": detalles
        })
        db.commit()
        
        return {
            "status": "success",
            "message": "Taller actualizado exitosamente"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar taller: {str(e)}")

@app.get("/api/departamentos")
def obtener_departamentos(db: Session = Depends(get_db)):
    query = text("""
        SELECT id, nombre, siglas, descripcion 
        FROM Departamentos 
        ORDER BY nombre
    """)
    result = db.execute(query).fetchall()
    return [
        {"id": row[0], "nombre": row[1], "siglas": row[2], "descripcion": row[3]}
        for row in result
    ]

@app.get("/api/areas-adscripcion")
def obtener_areas_adscripcion(
    id_departamento: Optional[int] = None, 
    db: Session = Depends(get_db)
):
    if id_departamento:
        query = text("""
            SELECT a.id, a.nombre, a.descripcion, d.nombre as departamento
            FROM AreasAdscripcion a
            LEFT JOIN Departamentos d ON a.id_departamento = d.id
            WHERE a.id_departamento = :id_departamento
            ORDER BY a.nombre
        """)
        result = db.execute(query, {"id_departamento": id_departamento}).fetchall()
    else:
        query = text("""
            SELECT a.id, a.nombre, a.descripcion, d.nombre as departamento
            FROM AreasAdscripcion a
            LEFT JOIN Departamentos d ON a.id_departamento = d.id
            ORDER BY a.nombre
        """)
        result = db.execute(query).fetchall()
    
    return [
        {"id": row[0], "nombre": row[1], "descripcion": row[2], "departamento": row[3]}
        for row in result
    ]

@app.get("/api/docente/detalles/{usuario_id}")
def obtener_detalles_docente(usuario_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT 
            p.nombre, p.ap, p.am, p.correoi, p.telefono,
            d.noEmpleado, d.rfc, d.cargo, d.especialidad,
            aa.nombre as area_adscripcion, aa.descripcion as area_descripcion,
            dep.nombre as departamento, dep.siglas as departamento_siglas,
            e.nombre as area_espacio
        FROM Personas p
        INNER JOIN Docentes d ON p.id = d.id_persona
        LEFT JOIN AreasAdscripcion aa ON d.id_area_adscripcion = aa.id
        LEFT JOIN Departamentos dep ON d.id_departamento = dep.id
        LEFT JOIN Areas e ON d.id_area_espacio = e.id
        WHERE p.id = :usuario_id
    """)
    result = db.execute(query, {"usuario_id": usuario_id}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    
    return {
        "nombre": f"{result[0]} {result[1]} {result[2]}" if result[2] else f"{result[0]} {result[1]}",
        "email": result[3],
        "telefono": result[4] or "No registrado",
        "noEmpleado": result[5],
        "rfc": result[6],
        "cargo": result[7] or "Docente",
        "especialidad": result[8] or "No especificada",
        "areaAdscripcion": result[9] or "No asignada",
        "areaDescripcion": result[10],
        "departamento": result[11] or "No asignado",
        "departamentoSiglas": result[12],
        "areaEspacio": result[13] or "No asignada"
    }

@app.put("/api/docente/actualizar-adscripcion")
def actualizar_adscripcion_docente(
    id_persona: int,
    id_area_adscripcion: Optional[int] = None,
    id_departamento: Optional[int] = None,
    cargo: Optional[str] = None,
    especialidad: Optional[str] = None,
    db: Session = Depends(get_db)
):
    update_fields = []
    params = {"id_persona": id_persona}
    
    if id_area_adscripcion is not None:
        update_fields.append("id_area_adscripcion = :id_area_adscripcion")
        params["id_area_adscripcion"] = id_area_adscripcion
    
    if id_departamento is not None:
        update_fields.append("id_departamento = :id_departamento")
        params["id_departamento"] = id_departamento
    
    if cargo is not None:
        update_fields.append("cargo = :cargo")
        params["cargo"] = cargo
    
    if especialidad is not None:
        update_fields.append("especialidad = :especialidad")
        params["especialidad"] = especialidad
    
    if not update_fields:
        return {"status": "info", "message": "No se realizaron cambios"}
    
    query = text(f"""
        UPDATE Docentes 
        SET {', '.join(update_fields)}
        WHERE id_persona = :id_persona
        RETURNING id
    """)
    
    try:
        result = db.execute(query, params)
        db.commit()
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Docente no encontrado")
        
        return {"status": "success", "message": "Información actualizada correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar: {str(e)}")

@app.get("/api/docente/talleres/historial/{docente_id}")
def obtener_historial_talleres_docente(
    docente_id: int,
    mes: Optional[int] = None,
    anio: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT 
            r.id,
            r.nombre as titulo,
            e.nombre as lugar,
            r.fecha,
            r.duracion,
            est.descripcion as estado,
            e.capacidad,
            (SELECT COUNT(*) FROM solicitudes s WHERE s.id_reserva = r.id) as inscritos,
            r.detalles as descripcion
        FROM reservas r
        INNER JOIN espacios e ON r.id_espacio = e.id
        INNER JOIN estatus est ON r.id_estatus = est.id
        WHERE r.id_docente = :docente_id
    """)
    
    params = {"docente_id": docente_id}
    
    if mes and anio:
        query = text(str(query) + """
            AND EXTRACT(MONTH FROM r.fecha) = :mes 
            AND EXTRACT(YEAR FROM r.fecha) = :anio
            ORDER BY r.fecha DESC
        """)
        params.update({"mes": mes, "anio": anio})
    else:
        query = text(str(query) + " ORDER BY r.fecha DESC LIMIT 50")
    
    try:
        result = db.execute(query, params).fetchall()
        
        talleres = []
        for row in result:
            fecha = row[3]
            duracion_str = str(row[4]) if row[4] else "0:00:00"
            
            try:
                duracion_parts = duracion_str.split(':')
                horas = int(duracion_parts[0])
                minutos = int(duracion_parts[1])
                fecha_fin = fecha + timedelta(hours=horas, minutes=minutos)
                hora_inicio = fecha.strftime("%H:%M")
                hora_fin = fecha_fin.strftime("%H:%M")
            except:
                hora_inicio = "00:00"
                hora_fin = "00:00"
            
            talleres.append({
                "id": row[0],
                "titulo": row[1],
                "lugar": row[2],
                "fecha": fecha.strftime("%Y-%m-%d") if fecha else None,
                "horaInicio": hora_inicio,
                "horaFin": hora_fin,
                "estado": row[5],
                "capacidad": row[6],
                "inscritos": row[7] or 0,
                "descripcion": row[8]
            })
        
        return talleres
        
    except Exception as e:
        print(f"Error en historial docente: {e}")
        return []