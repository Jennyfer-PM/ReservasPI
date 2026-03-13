<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Persona;

class PersonaController extends Controller
{
    public function index()
    {
        $personas = Persona::with(['estatus', 'alumno', 'docente', 'administrador'])->get();
        
        return response()->json($personas);
    }

    public function show($id)
    {
        $persona = Persona::with(['estatus', 'alumno.carrera', 'docente.area', 'administrador.area'])->findOrFail($id);
        
        return response()->json($persona);
    }

    public function update(Request $request, $id)
    {
        $persona = Persona::findOrFail($id);
        
        $data = $request->validate([
            'nombre' => 'string|max:150',
            'ap' => 'string|max:150',
            'am' => 'string|max:150',
            'edad' => 'integer',
            'telefono' => 'string|size:10',
            'id_estatus' => 'exists:estatus,id'
        ]);

        if ($request->has('clave')) {
            $data['clave'] = Hash::make($request->clave);
        }

        $persona->update($data);

        return response()->json($persona);
    }

    public function destroy($id)
    {
        $persona = Persona::findOrFail($id);
        $persona->delete();

        return response()->noContent();
    }
}