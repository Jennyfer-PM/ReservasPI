insert into Estatus(descrpcion) values
('Activo'),
('Baja'),
('Pendiente'),
('Autorizada'),
('Rechazada');

insert into Personas(nombre, ap, am, edad, correoI, clave, telefono, id_estatus) values
('Teodora', 'Cervantes', 'Rosas', 30, 'adminteodora@edu.mx', 'adminteodora1', '4424520983', 1),
('Armando', 'Gomez', 'Corin', 27, 'docentearmando@edu.mx', 'docentearmando1', '4421330987', 1),
('Maria', 'Morales', 'Torres', 35, 'docentemaria@edu.mx', 'docentemaria2', '4420985561', 1),
('Jose', 'Gonzales', 'Perez', 19, 'alumnojose@edu.mx', 'alumnojose1', '4424408998', 1),
('Samantha', 'Smith', 'Sanchez', 18, 'alumnosamantha@edu.mx', 'alumnosamantha2', '4429561101', 1);

insert into Carreras(nombre, siglas) values
('Tecnologías de la Información e Innovación Digital', 'TIID'),
('Tecnología Automotriz', 'TA'),
('Datos e Inteligencia Aritificial', 'DIA'),
('Manufactura Avanzada', 'MA'),
('Comercio Internacional', 'CI');

insert into Alumnos(matricula, id_persona, curp, id_carrera, cuatrimestre) values
('124049915', 4,'GOPJ051214HVZ', 1, 6),
('326791327', 5,'SMSS060616MHU', 3, 2);

insert into Areas(nombre) values
('Tecnologías'),
('Desarrollo Humano'),
('Idiomas'),
('Comercio'),
('Quimica');

insert into Docentes(noEmpleado, id_persona, rfc, id_area) values
('EMP1001', 2, 'GOCA990115MN6', 1),
('EMP2001', 3, 'MOTM910429B6F', 2);

insert into Administradores(noAdministrador, id_persona, id_area) values
('ADM1001', 1, 1);

insert into Espacios(nombre, id_area, capacidad, id_estatus) values
('Aula 101', 1, 30, 1),
('Sala de Computo 1', 1, 35, 1),
('Aula 203', 2, 30, 1),
('Auditorio 1', 4, 40, 1),
('Laboratorio 1', 5, 30, 1);

insert into Servicios(nombre) values
('Clase'),
('Taller'),
('Conferencia');

insert into Reservas(id_docente, nombre, id_espacio, fecha, duracion, id_servicio, detalles, id_colaborador, restricciones, id_estatus) values
(1, 'Clase de computo 1', 2, '2026-03-10 10:00:00', '1 hour 40 minutes', 1, 'Clase de computo básica', null, 'Solo estudiantes de TIID y DIA', 3),
(2, 'Taller socioemocional', 3, '2026-03-11 08:20:00', '50 minutes', 2, 'Taller para explorar emociones', null, null, 4),
(1, 'Conferencia con Egresados', 4, '2026-03-12 09:00:00', '1 hour 40 minutes', 3, 'Conferencia con egresados', 2, null, 3);

insert into Solicitudes(id_alumno, id_reserva, id_estatus) values
(1, 2, 4),
(2, 2, 3);








