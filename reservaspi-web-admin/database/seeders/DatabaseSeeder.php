<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Estatus
        DB::table('estatus')->insert([
            ['descripcion' => 'Activo'],
            ['descripcion' => 'Baja'],
            ['descripcion' => 'Pendiente'],
            ['descripcion' => 'Autorizada'],
            ['descripcion' => 'Rechazada'],
        ]);

        // 2. Personas (CONTRASEÑAS HASHEADAS)
        DB::table('personas')->insert([
            [
                'nombre' => 'Teodora',
                'ap' => 'Cervantes',
                'am' => 'Rosas',
                'edad' => 30,
                'correoi' => 'adminteodora@edu.mx',
                'clave' => Hash::make('adminteodora1'), // ¡ASÍ SE HACE!
                'telefono' => '4424520983',
                'id_estatus' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Armando',
                'ap' => 'Gomez',
                'am' => 'Corin',
                'edad' => 27,
                'correoi' => 'docentearmando@edu.mx',
                'clave' => Hash::make('docentearmando1'),
                'telefono' => '4421330987',
                'id_estatus' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Maria',
                'ap' => 'Morales',
                'am' => 'Torres',
                'edad' => 35,
                'correoi' => 'docentemaria@edu.mx',
                'clave' => Hash::make('docentemaria2'),
                'telefono' => '4420985561',
                'id_estatus' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Jose',
                'ap' => 'Gonzales',
                'am' => 'Perez',
                'edad' => 19,
                'correoi' => 'alumnojose@edu.mx',
                'clave' => Hash::make('alumnojose1'),
                'telefono' => '4424408998',
                'id_estatus' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Samantha',
                'ap' => 'Smith',
                'am' => 'Sanchez',
                'edad' => 18,
                'correoi' => 'alumnosamantha@edu.mx',
                'clave' => Hash::make('alumnosamantha2'),
                'telefono' => '4429561101',
                'id_estatus' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        // 3. Carreras
        DB::table('carreras')->insert([
            ['nombre' => 'Tecnologías de la Información e Innovación Digital', 'siglas' => 'TIID', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Tecnología Automotriz', 'siglas' => 'TA', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Datos e Inteligencia Artificial', 'siglas' => 'DIA', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Manufactura Avanzada', 'siglas' => 'MA', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Comercio Internacional', 'siglas' => 'CI', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 4. Areas
        DB::table('areas')->insert([
            ['nombre' => 'Tecnologías', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Desarrollo Humano', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Idiomas', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Comercio', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Quimica', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 5. Alumnos
        DB::table('alumnos')->insert([
            [
                'matricula' => '124049915',
                'id_persona' => 4,
                'curp' => 'GOPJ051214HVZ',
                'id_carrera' => 1,
                'cuatrimestre' => 6,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'matricula' => '326791327',
                'id_persona' => 5,
                'curp' => 'SMSS060616MHU',
                'id_carrera' => 3,
                'cuatrimestre' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        // 6. Docentes
        DB::table('docentes')->insert([
            [
                'noEmpleado' => 'EMP1001',
                'id_persona' => 2,
                'rfc' => 'GOCA990115MN6',
                'id_area' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'noEmpleado' => 'EMP2001',
                'id_persona' => 3,
                'rfc' => 'MOTM910429B6F',
                'id_area' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        // 7. Administradores
        DB::table('administradores')->insert([
            [
                'noAdministrador' => 'ADM1001',
                'id_persona' => 1,
                'id_area' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        // 8. Espacios
        DB::table('espacios')->insert([
            ['nombre' => 'Aula 101', 'id_area' => 1, 'capacidad' => 30, 'id_estatus' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Sala de Computo 1', 'id_area' => 1, 'capacidad' => 35, 'id_estatus' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Aula 203', 'id_area' => 2, 'capacidad' => 30, 'id_estatus' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Auditorio 1', 'id_area' => 4, 'capacidad' => 40, 'id_estatus' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Laboratorio 1', 'id_area' => 5, 'capacidad' => 30, 'id_estatus' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 9. Servicios
        DB::table('servicios')->insert([
            ['nombre' => 'Clase', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Taller', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Conferencia', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 10. Reservas
        DB::table('reservas')->insert([
            [
                'id_docente' => 1,
                'nombre' => 'Clase de computo 1',
                'id_espacio' => 2,
                'fecha' => '2026-03-10 10:00:00',
                'duracion' => '01:40:00',
                'id_servicio' => 1,
                'detalles' => 'Clase de computo básica',
                'id_colaborador' => null,
                'restricciones' => 'Solo estudiantes de TIID y DIA',
                'id_estatus' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id_docente' => 2,
                'nombre' => 'Taller socioemocional',
                'id_espacio' => 3,
                'fecha' => '2026-03-11 08:20:00',
                'duracion' => '00:50:00',
                'id_servicio' => 2,
                'detalles' => 'Taller para explorar emociones',
                'id_colaborador' => null,
                'restricciones' => null,
                'id_estatus' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id_docente' => 1,
                'nombre' => 'Conferencia con Egresados',
                'id_espacio' => 4,
                'fecha' => '2026-03-12 09:00:00',
                'duracion' => '01:40:00',
                'id_servicio' => 3,
                'detalles' => 'Conferencia con egresados',
                'id_colaborador' => 2,
                'restricciones' => null,
                'id_estatus' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        // 11. Solicitudes
        DB::table('solicitudes')->insert([
            [
                'id_alumno' => 1,
                'id_reserva' => 2,
                'id_estatus' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id_alumno' => 2,
                'id_reserva' => 2,
                'id_estatus' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}