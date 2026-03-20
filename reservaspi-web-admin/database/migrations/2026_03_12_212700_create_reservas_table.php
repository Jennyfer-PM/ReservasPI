<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_docente')->constrained('docentes');
            $table->string('nombre', 100);
            $table->foreignId('id_espacio')->constrained('espacios');
            $table->timestamp('fecha');
            $table->interval('duracion'); // PostgreSQL interval type
            $table->foreignId('id_servicio')->constrained('servicios');
            $table->text('detalles')->nullable();
            $table->foreignId('id_colaborador')->nullable()->constrained('docentes');
            $table->text('restricciones')->nullable();
            $table->foreignId('id_estatus')->constrained('estatus');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};