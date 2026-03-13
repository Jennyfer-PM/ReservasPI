<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Estatus;

class EstatusController extends Controller
{
    public function index()
    {
        return Estatus::all();
    }

    public function show($id)
    {
        return Estatus::findOrFail($id);
    }
}