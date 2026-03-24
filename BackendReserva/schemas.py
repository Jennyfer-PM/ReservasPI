from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    correo: EmailStr
    contrasena: str

class EspacioBase(BaseModel):
    id: int
    nombre: str
    capacidad: int
    id_estatus: int

    class Config:
        from_attributes = True

class RegistroCompletoRequest(BaseModel):
    nombre: str = Field(..., min_length=2)
    ap: str = Field(..., min_length=2)
    am: Optional[str] = None
    edad: int = Field(..., ge=17, le=100)
    correo: EmailStr
    contrasena: str = Field(..., min_length=6)
    telefono: Optional[str] = None
    tipo_usuario: str = Field(..., pattern="^(alumno|docente)$")
    matricula: Optional[str] = Field(None, min_length=9, max_length=9)
    curp: Optional[str] = Field(None, min_length=18, max_length=18)
    id_carrera: Optional[int] = None
    cuatrimestre: Optional[int] = Field(None, ge=1, le=12)
    no_empleado: Optional[str] = Field(None, min_length=7, max_length=7)
    rfc: Optional[str] = Field(None, min_length=13, max_length=13)

class RegistroRequest(BaseModel):
    nombre: str = Field(..., min_length=2)
    ap: str = Field(..., min_length=2)
    am: Optional[str] = None
    edad: int = Field(..., ge=17, le=100)
    correo: EmailStr
    contrasena: str = Field(..., min_length=6)
    telefono: str = Field(..., min_length=10)

class ReservaCreate(BaseModel):
    id_docente: int
    nombre: str = Field(..., min_length=3)
    id_espacio: int
    fecha: datetime
    duracion: str
    id_servicio: Optional[int] = 1
    detalles: Optional[str] = None
    asistentes: int = Field(..., ge=1, le=200)

class UsuarioUpdateRequest(BaseModel):
    id_persona: int
    telefono: Optional[str] = None
    contrasena: Optional[str] = Field(None, min_length=6)
    carrera: Optional[str] = None