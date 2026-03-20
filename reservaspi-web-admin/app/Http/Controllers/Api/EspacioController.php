<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Espacio;
use App\Models\Area;

class EspacioController extends Controller
{
    public function index()
    {
        $espacios = Espacio::with(['area', 'estatus'])->get();
        
        return response()->json($espacios);
    }

    public function show($id)
    {
        $espacio = Espacio::with(['area', 'estatus', 'reservas'])->findOrFail($id);
        
        return response()->json($espacio);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'id_area' => 'required|exists:areas,id',
            'capacidad' => 'required|integer',
            'id_estatus' => 'required|exists:estatus,id'
        ]);

        $espacio = Espacio::create($data);

        return response()->json($espacio, 201);
    }

    public function update(Request $request, $id)
    {
        $espacio = Espacio::findOrFail($id);
        
        $data = $request->validate([
            'nombre' => 'string|max:100',
            'id_area' => 'exists:areas,id',
            'capacidad' => 'integer',
            'id_estatus' => 'exists:estatus,id'
        ]);

        $espacio->update($data);

        return response()->json($espacio);
    }

    public function destroy($id)
    {
        $espacio = Espacio::findOrFail($id);
        $espacio->delete();

        return response()->noContent();
    }
}