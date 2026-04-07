const IP_ADDRESS = '10.16.3.115';  // Cambiar según la dirección ip de red
const API_PORT = '5000';             

export const API_BASE_URL = `http://${IP_ADDRESS}:${API_PORT}/api`;

export const API_TIMEOUT = 30000; 
export const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const handleApiError = (error, endpoint) => {
    console.error(`API Error [${endpoint}]:`, error);
    
    if (error.message === 'Network request failed') {
        return {
            error: true,
            message: 'No se puede conectar con el servidor. Verifica tu conexión.',
        };
    }
    
    if (error.response?.status === 404) {
        return {
            error: true,
            message: 'El recurso solicitado no existe.',
        };
    }
    
    if (error.response?.status === 500) {
        return {
            error: true,
            message: 'Error en el servidor. Intenta más tarde.',
        };
    }
    
    return {
        error: true,
        message: error.message || 'Error desconocido',
    };
};