from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Interval, Text
from database import Base

class Estatus(Base):
    __tablename__ = "estatus"
    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String(20))

class Persona(Base):
    __tablename__ = "personas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150))
    ap = Column(String(150))
    am = Column(String(150))
    edad = Column(Integer)
    correoI = Column(String(50))
    clave = Column(String(150))
    telefono = Column(String(10))
    id_estatus = Column(Integer, ForeignKey("estatus.id"))

class Carrera(Base):
    __tablename__ = "carreras"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150))
    siglas = Column(String(10))  # Corregido: de 5 a 10

class Alumno(Base):
    __tablename__ = "alumnos"
    id = Column(Integer, primary_key=True, index=True)
    matricula = Column(String(9))
    id_persona = Column(Integer, ForeignKey("personas.id"))
    curp = Column(String(18))  # Corregido: de 13 a 18
    id_carrera = Column(Integer, ForeignKey("carreras.id"))
    cuatrimestre = Column(Integer)

class Area(Base):
    __tablename__ = "areas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))

class Docente(Base):
    __tablename__ = "docentes"
    id = Column(Integer, primary_key=True, index=True)
    noEmpleado = Column(String(7))
    id_persona = Column(Integer, ForeignKey("personas.id"))
    rfc = Column(String(13))
    id_area = Column(Integer, ForeignKey("areas.id"))

class Administrador(Base):
    __tablename__ = "administradores"
    id = Column(Integer, primary_key=True, index=True)
    noAdministrador = Column(String(7))
    id_persona = Column(Integer, ForeignKey("personas.id"))
    id_area = Column(Integer, ForeignKey("areas.id"))

class Espacio(Base):
    __tablename__ = "espacios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    id_area = Column(Integer, ForeignKey("areas.id"))
    capacidad = Column(Integer)
    id_estatus = Column(Integer, ForeignKey("estatus.id"))

class Servicio(Base):
    __tablename__ = "servicios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))

class Reserva(Base):
    __tablename__ = "reservas"
    id = Column(Integer, primary_key=True, index=True)
    id_docente = Column(Integer, ForeignKey("docentes.id"))
    nombre = Column(String(100))
    id_espacio = Column(Integer, ForeignKey("espacios.id"))
    fecha = Column(DateTime)
    duracion = Column(Interval)
    id_servicio = Column(Integer, ForeignKey("servicios.id"))
    detalles = Column(Text, nullable=True)
    id_colaborador = Column(Integer, ForeignKey("docentes.id"), nullable=True)
    restricciones = Column(Text, nullable=True)
    id_estatus = Column(Integer, ForeignKey("estatus.id"))

class Solicitud(Base):
    __tablename__ = "solicitudes"
    id = Column(Integer, primary_key=True, index=True)
    id_alumno = Column(Integer, ForeignKey("alumnos.id"))
    id_reserva = Column(Integer, ForeignKey("reservas.id"))
    id_estatus = Column(Integer, ForeignKey("estatus.id"))