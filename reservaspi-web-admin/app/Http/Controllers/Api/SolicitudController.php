<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Solicitud;
use App\Models\Reserva;

class SolicitudController extends Controller
{
    public function index()
    {
        $solicitudes = Solicitud::with([
            'alumno.persona',
            'reserva.espacio.area',
            'reserva.docente.persona',
            'estatus'
        ])->get();
        
        return response()->json($solicitudes);
    }

    public function show($id)
    {
        $solicitud = Solicitud::with([
            'alumno.persona',
            'alumno.carrera',
            'reserva.espacio.area',
            'reserva.docente.persona',
            'reserva.servicio',
            'estatus'
        ])->findOrFail($id);
        
        return response()->json($solicitud);
    }

    // Aprobar solicitud (cambiar estatus a 4 - Autorizada)
    public function aprobar($id)
    {
        $solicitud = Solicitud::findOrFail($id);
        $solicitud->id_estatus = 4; // Autorizada
        $solicitud->save();
        
        // También aprobar la reserva asociada
        $reserva = Reserva::find($solicitud->id_reserva);
        if ($reserva) {
            $reserva->id_estatus = 4;
            $reserva->save();
        }

        return response()->json(['message' => 'Solicitud aprobada']);
    }

    // Rechazar solicitud (cambiar estatus a 5 - Rechazada)
    public function rechazar($id)
    {
        $solicitud = Solicitud::findOrFail($id);
        $solicitud->id_estatus = 5; // Rechazada
        $solicitud->save();

        return response()->json(['message' => 'Solicitud rechazada']);
    }
}