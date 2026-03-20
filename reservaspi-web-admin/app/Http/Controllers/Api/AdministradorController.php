<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Administrador;

class AdministradorController extends Controller
{
    public function index()
    {
        $administradores = Administrador::with(['persona', 'area'])->get();
        
        return response()->json($administradores);
    }

    public function show($id)
    {
        $admin = Administrador::with(['persona', 'area'])->findOrFail($id);
        
        return response()->json($admin);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'noAdministrador' => 'required|string|max:7|unique:administradores',
            'id_persona' => 'required|exists:personas,id|unique:administradores',
            'id_area' => 'required|exists:areas,id'
        ]);

        $admin = Administrador::create($data);

        return response()->json($admin, 201);
    }

    public function update(Request $request, $id)
    {
        $admin = Administrador::findOrFail($id);
        
        $data = $request->validate([
            'noAdministrador' => 'string|max:7|unique:administradores,noAdministrador,' . $id,
            'id_area' => 'exists:areas,id'
        ]);

        $admin->update($data);

        return response()->json($admin);
    }

    public function destroy($id)
    {
        $admin = Administrador::findOrFail($id);
        $admin->delete();

        return response()->noContent();
    }
}