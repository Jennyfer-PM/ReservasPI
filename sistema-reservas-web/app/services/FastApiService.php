<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FastApiService
{
    protected $baseUrl;
    
    public function __construct()
    {
        $this->baseUrl = config('fastapi.url');
    }
    
    protected function request($method, $endpoint, $data = [])
    {
        $url = $this->baseUrl . '/api' . $endpoint;
        
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])->$method($url, $data);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return [
                'error' => true,
                'message' => $response->json()['detail'] ?? 'Error en la comunicación',
                'status' => $response->status()
            ];
            
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => 'No se pudo conectar con FastAPI',
                'exception' => $e->getMessage()
            ];
        }
    }
    
    public function get($endpoint)
    {
        return $this->request('get', $endpoint);
    }
    
    public function post($endpoint, $data)
    {
        return $this->request('post', $endpoint, $data);
    }
    
    public function put($endpoint, $data)
    {
        return $this->request('put', $endpoint, $data);
    }
    
    public function delete($endpoint)
    {
        return $this->request('delete', $endpoint);
    }
}