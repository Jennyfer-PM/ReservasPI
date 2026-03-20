from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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

@app.post("/api/login")
def login(datos: schemas.LoginRequest, db: Session = Depends(get_db)):
    query = text("""
        SELECT id, nombre, "correoI" 
        FROM Personas 
        WHERE "correoI" = :correo AND clave = :clave
    """)
    usuario = db.execute(query, {"correo": datos.correo, "clave": datos.contrasena}).fetchone()
    if not usuario:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    return {"status": "success", "usuario": usuario[1], "id": usuario[0]}

@app.post("/api/register")
def registrar_usuario(datos: schemas.RegistroRequest, db: Session = Depends(get_db)):
    if not datos.correo.lower().endswith("@upq.edu.mx"):
        raise HTTPException(status_code=400, detail="Solo se permiten registros institucionales")
    query = text("""
        INSERT INTO Personas (nombre, ap, am, edad, "correoI", clave, telefono, id_estatus)
        VALUES (:nombre, :ap, :am, :edad, :correo, :clave, :telefono, 1)
    """)
    try:
        db.execute(query, {
            "nombre": datos.nombre, "ap": datos.ap, "am": datos.am, 
            "edad": datos.edad, "correo": datos.correo, 
            "clave": datos.contrasena, "telefono": datos.telefono
        })
        db.commit()
        return {"status": "success", "message": "Usuario creado"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al registrar")

@app.get("/api/espacios", response_model=List[schemas.EspacioBase])
def leer_espacios(db: Session = Depends(get_db)):
    espacios = db.query(models.Espacio).all()
    return espacios

@app.get("/api/reservas")
def obtener_reservas(db: Session = Depends(get_db)):
    query = text("""
        SELECT 
            s.id, 
            e.nombre as espacio, 
            r.nombre as reserva, 
            r.fecha, 
            est.descripcion as estado
        FROM Solicitudes s
        INNER JOIN Reservas r ON s.id_reserva = r.id
        INNER JOIN Espacios e ON r.id_espacio = e.id
        INNER JOIN Estatus est ON s.id_estatus = est.id
    """)
    try:
        result = db.execute(query).fetchall()
        return [
            {
                "id": row[0],
                "espacio_nombre": row[1],
                "proposito": row[2],
                "fecha": str(row[3]),
                "estado": row[4]
            } for row in result
        ]
    except Exception as e:
        print(f"Error en Reservas: {e}")
        return []

@app.get("/api/usuario/{usuario_id}")
def obtener_perfil_usuario(usuario_id: int, db: Session = Depends(get_db)):
    query_usuario = text('SELECT nombre, ap, am, "correoI", telefono FROM Personas WHERE id = :id')
    user = db.execute(query_usuario, {"id": usuario_id}).fetchone()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    query_stats = text("""
        SELECT 
            COUNT(s.id), 
            SUM(CASE WHEN e.descripcion = 'Aprobada' THEN 1 ELSE 0 END)
        FROM Alumnos a
        LEFT JOIN Solicitudes s ON a.id = s.id_alumno
        LEFT JOIN Estatus e ON s.id_estatus = e.id
        WHERE a.id_persona = :id
    """)
    stats = db.execute(query_stats, {"id": usuario_id}).fetchone()

    return {
        "nombre": f"{user[0]} {user[1]} {user[2]}",
        "puesto": "Alumno UPQ",
        "email": user[3],
        "telefono": user[4] or "No registrado",
        "totales": stats[0] if stats and stats[0] else 0,
        "aprobadas": stats[1] if stats and stats[1] else 0
    }

@app.get("/api/reservas/usuario/{usuario_id}")
def obtener_historial_especifico(
    usuario_id: int, 
    mes: int, 
    anio: int, 
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
        AND EXTRACT(MONTH FROM r.fecha) = :mes 
        AND EXTRACT(YEAR FROM r.fecha) = :anio
        ORDER BY r.fecha DESC
    """)
    try:
        result = db.execute(query, {"id": usuario_id, "mes": mes, "anio": anio}).fetchall()
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