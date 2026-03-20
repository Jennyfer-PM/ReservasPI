from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Molde para recibir los datos del Login
class LoginRequest(BaseModel):
    correo: EmailStr
    contrasena: str

# Molde para enviar los datos de los espacios a la App
class EspacioBase(BaseModel):
    id: int
    nombre: str
    capacidad: int
    id_estatus: int
    tipo: Optional[str] = "General"
    ubicacion: Optional[str] = "No especificada"
    estatus: Optional[str] = "Activo"

    class Config:
        from_attributes = True

# Molde para registro de usuarios
class RegistroRequest(BaseModel):
    nombre: str
    ap: str
    am: Optional[str] = None
    edad: int
    correo: EmailStr
    contrasena: str
    telefono: str

# Molde para creación de reservas
class ReservaCreate(BaseModel):
    id_docente: int
    nombre: str
    id_espacio: int
    fecha: datetime
    duracion: str
    id_servicio: int

class ReservaCreate(BaseModel):
    id_docente: int
    nombre: str  # Propósito de la reserva
    id_espacio: int
    fecha: datetime
    duracion: str
    id_servicio: Optional[int] = 1
    detalles: Optional[str] = None # Para las observaciones
    asistentes: int # Nueva columna para validar capacidad