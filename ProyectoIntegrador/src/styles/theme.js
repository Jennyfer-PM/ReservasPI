import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

export const COLORS = {
    // Colores Institucionales y Principales
    primary: '#00d97e',      // El verde que usas en el Home/Login
    secondary: '#2563eb',    // El azul de Perfil/Botones
    dark: '#1e293b',         // Slate oscuro para textos y headers
    
    // Neutros
    background: '#f8fafc',
    white: '#ffffff',
    border: '#e2e8f0',
    textMain: '#0f172a',
    textSub: '#64748b',
    
    // Estados
    error: '#ef4444',
    success: '#16a34a',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Transparencias
    overlay: 'rgba(0,0,0,0.4)',
};

export const SIZES = {
    width,
    height,
    isWeb,
    breakpoint: 768,
    padding: isWeb ? 40 : 20,
    radius: {
        small: 8,
        medium: 14,
        large: 20,
        full: 50
    }
};

export const SHADOWS = {
    light: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    }
};

export const TYPOGRAPHY = {
    h1: { fontSize: isWeb ? 32 : 28, fontWeight: 'bold', color: COLORS.textMain },
    h2: { fontSize: isWeb ? 24 : 20, fontWeight: 'bold', color: COLORS.textMain },
    body: { fontSize: 15, color: COLORS.textMain },
    caption: { fontSize: 13, color: COLORS.textSub },
};