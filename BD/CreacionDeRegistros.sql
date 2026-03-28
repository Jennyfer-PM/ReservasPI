-- Insertar Estatus
insert into Estatus(descripcion) values
('Activo'),
('Baja'),
('Pendiente'),
('Autorizada'),
('Rechazada');

-- Insertar Personas
insert into Personas(nombre, ap, am, edad, correoI, clave, telefono, id_estatus) values
('Teodora', 'Cervantes', 'Rosas', 30, 'adminteodora@upq.edu.mx', 'admin123', '4424520983', 1),
('Armando', 'Gomez', 'Corin', 27, 'armando.gomez@upq.edu.mx', 'docente123', '4421330987', 1),
('Maria', 'Morales', 'Torres', 35, 'maria.morales@upq.edu.mx', 'docente123', '4420985561', 1),
('Jose', 'Gonzales', 'Perez', 19, '124049915@upq.edu.mx', 'alumno123', '4424408998', 1),
('Samantha', 'Smith', 'Sanchez', 18, '326791327@upq.edu.mx', 'alumno123', '4429561101', 1);

-- Insertar Carreras
insert into Carreras(nombre, siglas) values
('Tecnologías de la Información e Innovación Digital', 'TIID'),
('Tecnología Automotriz', 'TA'),
('Datos e Inteligencia Artificial', 'DIA'),
('Manufactura Avanzada', 'MA'),
('Comercio Internacional', 'CI');

-- Insertar Alumnos
insert into Alumnos(matricula, id_persona, curp, id_carrera, cuatrimestre) values
('124049915', 4, 'GOPJ051214HDFLPR09', 1, 6),
('326791327', 5, 'SMSS060616MHUXXX09', 3, 2);

-- Insertar Areas (nombres exactos para coincidir con imágenes)
insert into Areas(nombre) values
('Laboratorios'),
('Salas de Cómputo'),
('Auditorios'),
('Biblioteca'),
('Salas'),
('Talleres'),
('Salones');

-- Insertar Docentes
insert into Docentes(noEmpleado, id_persona, rfc, id_area) values
('EMP1001', 2, 'GOCA990115MN6', 1),
('EMP2001', 3, 'MOTM910429B6F', 2);

-- Insertar Administradores
insert into Administradores(noAdministrador, id_persona, id_area) values
('ADM1001', 1, 1);

-- Insertar Espacios
insert into Espacios(nombre, id_area, capacidad, id_estatus) values
-- Laboratorios
('Laboratorio de Redes', (SELECT id FROM Areas WHERE nombre = 'Laboratorios'), 30, 1),
('Laboratorio de Programación', (SELECT id FROM Areas WHERE nombre = 'Laboratorios'), 35, 1),
('Laboratorio de Electrónica', (SELECT id FROM Areas WHERE nombre = 'Laboratorios'), 25, 1),

-- Salas de Cómputo
('Sala de Cómputo 1', (SELECT id FROM Areas WHERE nombre = 'Salas de Cómputo'), 35, 1),
('Sala de Cómputo 2', (SELECT id FROM Areas WHERE nombre = 'Salas de Cómputo'), 30, 1),
('Sala de Cómputo Especializada', (SELECT id FROM Areas WHERE nombre = 'Salas de Cómputo'), 20, 1),

-- Auditorios
('Auditorio Principal', (SELECT id FROM Areas WHERE nombre = 'Auditorios'), 100, 1),
('Auditorio de Conferencias', (SELECT id FROM Areas WHERE nombre = 'Auditorios'), 80, 1),
('Auditorio de Eventos', (SELECT id FROM Areas WHERE nombre = 'Auditorios'), 60, 1),

-- Biblioteca
('Sala de Lectura', (SELECT id FROM Areas WHERE nombre = 'Biblioteca'), 50, 1),
('Área de Estudio Grupal', (SELECT id FROM Areas WHERE nombre = 'Biblioteca'), 40, 1),
('Hemeroteca', (SELECT id FROM Areas WHERE nombre = 'Biblioteca'), 30, 1),

-- Salas
('Sala de Juntas', (SELECT id FROM Areas WHERE nombre = 'Salas'), 20, 1),
('Sala de Reuniones', (SELECT id FROM Areas WHERE nombre = 'Salas'), 15, 1),
('Sala de Videoconferencias', (SELECT id FROM Areas WHERE nombre = 'Salas'), 25, 1),

-- Talleres
('Taller de Robótica', (SELECT id FROM Areas WHERE nombre = 'Talleres'), 25, 1),
('Taller de Diseño', (SELECT id FROM Areas WHERE nombre = 'Talleres'), 20, 1),
('Taller de Innovación', (SELECT id FROM Areas WHERE nombre = 'Talleres'), 30, 1),

-- Salones
('Aula 101', (SELECT id FROM Areas WHERE nombre = 'Salones'), 35, 1),
('Aula 102', (SELECT id FROM Areas WHERE nombre = 'Salones'), 35, 1),
('Aula 201', (SELECT id FROM Areas WHERE nombre = 'Salones'), 40, 1),
('Aula 202', (SELECT id FROM Areas WHERE nombre = 'Salones'), 40, 1),
('Aula Magna', (SELECT id FROM Areas WHERE nombre = 'Salones'), 60, 1);

-- Insertar Servicios
insert into Servicios(nombre) values
('Clase'),
('Taller'),
('Conferencia'),
('Evento Cultural'),
('Examen');

-- Insertar Reservas
insert into Reservas(id_docente, nombre, id_espacio, fecha, duracion, id_servicio, detalles, id_colaborador, restricciones, id_estatus) values
(1, 'Clase de Programación', 2, '2026-04-10 10:00:00', '1 hour 40 minutes', 1, 'Clase de programación básica', null, 'Solo estudiantes de TIID y DIA', 3),
(2, 'Taller de Inteligencia Emocional', 3, '2026-04-11 08:20:00', '50 minutes', 2, 'Taller para explorar emociones', null, null, 3),
(1, 'Conferencia con Egresados', 4, '2026-04-12 09:00:00', '1 hour 40 minutes', 3, 'Conferencia con egresados exitosos', 2, null, 3);

-- Insertar Solicitudes
insert into Solicitudes(id_alumno, id_reserva, id_estatus) values
(1, 2, 4),
(2, 2, 3);