-- Tabla Estatus
create table Estatus(
    id serial primary key,
    descripcion varchar(20)
);

-- Tabla Personas
create table Personas (
    id serial primary key,
    nombre varchar(150),
    ap varchar(150),
    am varchar(150),
    edad int,
    correoI varchar(50) unique,
    clave varchar(150),
    telefono varchar(10),
    id_estatus int,
    foreign key (id_estatus) references Estatus(id)
);

-- Tabla Carreras
create table Carreras(
    id serial primary key,
    nombre varchar(150),
    siglas varchar(10)
);

-- Tabla Alumnos
create table Alumnos(
    id serial primary key,
    matricula varchar(9) unique,
    id_persona int,
    curp varchar(18),
    id_carrera int,
    cuatrimestre int,
    foreign key (id_persona) references Personas(id),
    foreign key (id_carrera) references Carreras(id)
);

-- Tabla Areas
create table Areas(
    id serial primary key,
    nombre varchar(100)
);

-- Tabla Docentes
create table Docentes(
    id serial primary key,
    noEmpleado varchar(7) unique,
    id_persona int,
    rfc varchar(13),
    id_area int,
    foreign key (id_persona) references Personas(id),
    foreign key (id_area) references Areas(id)
);

-- Tabla Administradores
create table Administradores(
    id serial primary key,
    noAdministrador varchar(7) unique,
    id_persona int,
    id_area int,
    foreign key (id_persona) references Personas(id),
    foreign key (id_area) references Areas(id)
);

-- Tabla Espacios
create table Espacios(
    id serial primary key,
    nombre varchar(100),
    id_area int,
    capacidad int,
    id_estatus int,
    foreign key (id_area) references Areas(id),
    foreign key (id_estatus) references Estatus(id)
);

-- Tabla Servicios
create table Servicios(
    id serial primary key,
    nombre varchar(100)
);

-- Tabla Reservas
create table Reservas(
    id serial primary key,
    id_docente int,
    nombre varchar(100),
    id_espacio int,
    fecha timestamp,
    duracion interval,
    id_servicio int,
    detalles text,
    id_colaborador int,
    restricciones text,
    id_estatus int,
    foreign key (id_docente) references Docentes(id),
    foreign key (id_espacio) references Espacios(id),
    foreign key (id_servicio) references Servicios(id),
    foreign key (id_colaborador) references Docentes(id),
    foreign key (id_estatus) references Estatus(id)
);

-- Tabla Solicitudes
create table Solicitudes(
    id serial primary key,
    id_alumno int,
    id_reserva int,
    id_estatus int,
    foreign key (id_alumno) references Alumnos(id),
    foreign key (id_reserva) references Reservas(id),
    foreign key (id_estatus) references Estatus(id)
);