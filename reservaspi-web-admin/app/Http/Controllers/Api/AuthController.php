<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Persona;
use App\Models\Administrador;

class AuthController extends Controller
{
    // Login (PDF página 7-9)
    public function login(Request $request)
{
    $data = $request->validate([
        'correoI' => 'required|string',
        'clave' => 'required|string'
    ]);

    // USAR MINÚSCULAS AQUÍ
    $persona = Persona::where('correoi', $data['correoI'])->first();

    if (!$persona || !Hash::check($data['clave'], $persona->clave)) {
        throw ValidationException::withMessages([
            'correoI' => ['Credenciales incorrectas.']
        ]);
    }

    $admin = Administrador::where('id_persona', $persona->id)->first();
    
    $token = $persona->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'usuario' => [
            'id' => $persona->id,
            'nombre' => $persona->nombre . ' ' . $persona->ap . ' ' . $persona->am,
            'correo' => $persona->correoI,
            'es_admin' => $admin ? true : false,
            'admin' => $admin ? [
                'id' => $admin->id,
                'noAdministrador' => $admin->noAdministrador,
                'area' => $admin->area->nombre ?? null
            ] : null
        ]
    ]);
}
    // Obtener usuario autenticado (PDF página 10)
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['estatus', 'administrador.area']);
        
        return response()->json($user);
    }

    // Cerrar sesión (PDF página 11)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    // Registro (nuevo, no está en PDF pero lo necesitas)
    public function register(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:150',
            'ap' => 'required|string|max:150',
            'am' => 'required|string|max:150',
            'edad' => 'required|integer',
            'correoI' => 'required|string|email|max:50|unique:personas',
            'clave' => 'required|string|min:6',
            'telefono' => 'required|string|size:10'
        ]);

        $data['clave'] = Hash::make($data['clave']);
        $data['id_estatus'] = 1; // Activo por defecto

        $persona = Persona::create($data);

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'usuario' => $persona
        ], 201);
    }
}
