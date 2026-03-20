from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Interval, Text
from database import Base

class Estatus(Base):
    __tablename__ = "estatus"
    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String(20))

class Espacio(Base):
    __tablename__ = "espacios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    id_area = Column(Integer)
    capacidad = Column(Integer)
    id_estatus = Column(Integer, ForeignKey("estatus.id"))
    # --- NUEVAS COLUMNAS ---
    tipo = Column(String(50))
    ubicacion = Column(String(100))
    estatus = Column(String(20))

class Reserva(Base):
    __tablename__ = "reservas"
    id = Column(Integer, primary_key=True, index=True)
    id_docente = Column(Integer)
    nombre = Column(String(100))
    id_espacio = Column(Integer, ForeignKey("espacios.id"))
    fecha = Column(DateTime)
    duracion = Column(Interval)
    id_servicio = Column(Integer)
    detalles = Column(Text, nullable=True)
    id_colaborador = Column(Integer, nullable=True)
    restricciones = Column(Text, nullable=True)
    id_estatus = Column(Integer, ForeignKey("estatus.id"))