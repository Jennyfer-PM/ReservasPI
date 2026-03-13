<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('docentes', function (Blueprint $table) {
            $table->id();
            $table->string('noEmpleado', 7)->unique();
            $table->foreignId('id_persona')->constrained('personas');
            $table->string('rfc', 13)->unique();
            $table->foreignId('id_area')->constrained('areas');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('docentes');
    }
};