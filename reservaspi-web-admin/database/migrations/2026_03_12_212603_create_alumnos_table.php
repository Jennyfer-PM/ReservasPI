<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumnos', function (Blueprint $table) {
            $table->id();
            $table->string('matricula', 9)->unique();
            $table->foreignId('id_persona')->constrained('personas');
            $table->string('curp', 18)->unique();
            $table->foreignId('id_carrera')->constrained('carreras');
            $table->integer('cuatrimestre');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumnos');
    }
};