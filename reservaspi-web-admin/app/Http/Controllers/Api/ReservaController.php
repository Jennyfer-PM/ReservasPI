<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;

class ReservaController extends Controller
{
    public function index()
    {
        $reservas = Reserva::with([
            'docente.persona',
            'espacio.area',
            'servicio',
            'colaborador.persona',
            'estatus'
        ])->get();
        
        return response()->json($reservas);
    }

    public function show($id)
    {
        $reserva = Reserva::with([
            'docente.persona',
            'espacio.area',
            'servicio',
            'colaborador.persona',
            'estatus',
            'solicitudes.alumno.persona'
        ])->findOrFail($id);
        
        return response()->json($reserva);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_docente' => 'required|exists:docentes,id',
            'nombre' => 'required|string|max:100',
            'id_espacio' => 'required|exists:espacios,id',
            'fecha' => 'required|date',
            'duracion' => 'required',
            'id_servicio' => 'required|exists:servicios,id',
            'detalles' => 'nullable|string',
            'id_colaborador' => 'nullable|exists:docentes,id',
            'restricciones' => 'nullable|string',
            'id_estatus' => 'required|exists:estatus,id'
        ]);

        $reserva = Reserva::create($data);

        return response()->json($reserva, 201);
    }

    public function update(Request $request, $id)
    {
        $reserva = Reserva::findOrFail($id);
        
        $data = $request->validate([
            'nombre' => 'string|max:100',
            'fecha' => 'date',
            'duracion' => '',
            'detalles' => 'nullable|string',
            'restricciones' => 'nullable|string',
            'id_estatus' => 'exists:estatus,id'
        ]);

        $reserva->update($data);

        return response()->json($reserva);
    }

    public function destroy($id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->delete();

        return response()->noContent();
    }
}