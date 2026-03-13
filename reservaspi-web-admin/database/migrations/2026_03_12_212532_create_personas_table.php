<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150);
            $table->string('ap', 150);
            $table->string('am', 150);
            $table->integer('edad');
            $table->string('correoi', 50); // ¡MINÚSCULA! Así funciona con PostgreSQL
            $table->string('clave', 150);
            $table->string('telefono', 10);
            $table->foreignId('id_estatus')->constrained('estatus');
            $table->timestamps();
            
            // Índice para búsquedas rápidas por correo
            $table->index('correoi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};