import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    RefreshControl,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';
import { API_BASE_URL } from '../constants/api';
import { getUserParams } from '../navigation/appNavigator';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const DocenteHomeScreen = ({ navigation, route }) => {
    const params = route.params || {};
    let usuario = params.usuario;
    let idUsuario = params.idUsuario;
    let tipoUsuario = params.tipoUsuario;
    
    if (!idUsuario) {
        const globalParams = getUserParams();
        usuario = globalParams.usuario || usuario;
        idUsuario = globalParams.idUsuario;
        tipoUsuario = globalParams.tipoUsuario || 'docente';
    }
    
    const [windowWidth, setWindowWidth] = useState(width);
    const [talleres, setTalleres] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalTalleres: 0,
        totalInscritos: 0,
        pendientes: 0
    });
    const [cargando, setCargando] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [docenteId, setDocenteId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        if (idUsuario) {
            obtenerIdDocente();
        } else {
            setError("No se pudo identificar al usuario. Por favor, cierra sesión y vuelve a iniciar.");
            setCargando(false);
        }
    }, [idUsuario]);

    const obtenerIdDocente = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuario/docente/${idUsuario}`);
            
            if (response.ok) {
                const data = await response.json();
                setDocenteId(data.id);
                cargarDatos(data.id);
            } else {
                setError("No se encontró el registro de docente");
                setCargando(false);
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setCargando(false);
        }
    };

    const cargarDatos = async (docId) => {
        try {
            setCargando(true);
            setError(null);
            
            const talleresResponse = await fetch(`${API_BASE_URL}/docente/talleres/${docId}`);
            
            if (talleresResponse.ok) {
                const data = await talleresResponse.json();
                setTalleres(data);
            } else {
                setError("No se pudieron cargar los talleres");
            }
            
            const statsResponse = await fetch(`${API_BASE_URL}/docente/estadisticas/${docId}`);
            if (statsResponse.ok) {
                const data = await statsResponse.json();
                setEstadisticas(data);
            }
            
        } catch (error) {
            setError("Error de conexión con el servidor");
        } finally {
            setCargando(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (docenteId) {
            cargarDatos(docenteId);
        } else if (idUsuario) {
            obtenerIdDocente();
        } else {
            setRefreshing(false);
        }
    };

    const isWebLayout = windowWidth > 768;

    const getDiasRestantes = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        const hoy = new Date();
        const fechaTaller = new Date(fecha);
        const diffTime = fechaTaller - hoy;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Finalizado';
        if (diffDays === 0) return 'Hoy';
        return `En ${diffDays} días`;
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Autorizada': return '#10B981';
            case 'Pendiente': return '#F59E0B';
            case 'Rechazada': return '#EF4444';
            default: return '#64748B';
        }
    };

    const getEstadoBgColor = (estado) => {
        switch (estado) {
            case 'Autorizada': return '#E8F5E9';
            case 'Pendiente': return '#FFF3E0';
            case 'Rechazada': return '#FFEBEE';
            default: return '#F5F5F5';
        }
    };

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Header userName={usuario} role="Docente" isWeb={isWebLayout} navigation={navigation} idUsuario={idUsuario} />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                    <Text style={styles.errorTitle}>Error</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.errorButton} 
                        onPress={() => {
                            setError(null);
                            setCargando(true);
                            if (idUsuario) obtenerIdDocente();
                        }}
                    >
                        <Text style={styles.errorButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.errorButton, { backgroundColor: '#64748B', marginTop: 10 }]} 
                        onPress={() => navigation.replace('Login')}
                    >
                        <Text style={styles.errorButtonText}>Volver al login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (cargando && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <Header userName={usuario} role="Docente" isWeb={isWebLayout} navigation={navigation} idUsuario={idUsuario} />
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#00d97e" />
                    <Text style={styles.loaderText}>Cargando tus talleres...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            <Header 
                userName={usuario} 
                role="Docente" 
                isWeb={isWebLayout} 
                navigation={navigation} 
                idUsuario={idUsuario} 
            />

            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00d97e']} />
                }
            >
                <View style={styles.welcomeBanner}>
                    <Text style={styles.welcomeTitle}>Bienvenido, {usuario?.split(' ')[0] || 'Docente'}</Text>
                    <Text style={styles.welcomeSub}>Gestiona tus talleres y espacios</Text>
                </View>

                <TouchableOpacity
                    style={styles.btnNewTaller}
                    onPress={() => navigation.navigate('CrearTaller', { usuario, idUsuario })}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                    <View style={styles.btnNewTallerTextContainer}>
                        <Text style={styles.btnNewTitle}>Crear nuevo taller</Text>
                        <Text style={styles.btnNewSub}>Organiza una nueva actividad académica</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#FFFFFF" style={{ opacity: 0.8 }} />
                </TouchableOpacity>

                <View style={styles.kpiGrid}>
                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIconBox, { backgroundColor: '#EFF6FF' }]}>
                            <Ionicons name="calendar-outline" size={22} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.kpiValue}>{estadisticas.totalTalleres}</Text>
                            <Text style={styles.kpiLabel}>Talleres totales</Text>
                        </View>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIconBox, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="people-outline" size={22} color="#10B981" />
                        </View>
                        <View>
                            <Text style={styles.kpiValue}>{estadisticas.totalInscritos}</Text>
                            <Text style={styles.kpiLabel}>Alumnos inscritos</Text>
                        </View>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIconBox, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="time-outline" size={22} color="#F59E0B" />
                        </View>
                        <View>
                            <Text style={styles.kpiValue}>{estadisticas.pendientes}</Text>
                            <Text style={styles.kpiLabel}>Pendientes</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.talleresHeader}>
                    <Text style={styles.sectionTitle}>Mis talleres</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Mis Talleres', { usuario, idUsuario, tipoUsuario: 'docente' })}>
                        <Text style={styles.verHistorial}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                {talleres.length > 0 ? (
                    talleres.slice(0, 5).map((taller) => (
                        <TouchableOpacity 
                            key={taller.id} 
                            style={styles.tallerCard}
                            onPress={() => navigation.navigate('DetalleTaller', { taller, usuario, idUsuario })}
                        >
                            <View style={[styles.statusBadge, { backgroundColor: getEstadoBgColor(taller.estado) }]}>
                                <Text style={[styles.statusText, { color: getEstadoColor(taller.estado) }]}>
                                    {taller.estado}
                                </Text>
                            </View>
                            <Text style={styles.tallerTitle}>{taller.titulo}</Text>
                            <Text style={styles.tallerLugar}>{taller.lugar}</Text>

                            <View style={styles.tallerDetailRow}>
                                <Ionicons name="calendar-outline" size={14} color="#777" />
                                <Text style={styles.tallerDetailText}>
                                    {getDiasRestantes(taller.fecha)} • {taller.horaInicio} - {taller.horaFin}
                                </Text>
                            </View>

                            <View style={styles.tallerDetailRow}>
                                <Ionicons name="people-outline" size={14} color="#777" />
                                <Text style={styles.tallerDetailText}>
                                    {taller.inscritos}/{taller.capacidad} inscritos
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>No tienes talleres creados</Text>
                        <Text style={styles.emptyText}>Presiona "Crear nuevo taller" para comenzar</Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('CrearTaller', { usuario, idUsuario })}
                        >
                            <Text style={styles.emptyButtonText}>Crear nuevo taller</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 16,
    },
    errorText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
        textAlign: 'center',
    },
    errorButton: {
        backgroundColor: '#00d97e',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 20,
    },
    errorButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    welcomeBanner: {
        backgroundColor: '#00d97e',
        paddingVertical: 28,
        paddingHorizontal: 20,
    },
    welcomeTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    welcomeSub: {
        color: '#ffffff',
        fontSize: 13,
        opacity: 0.9,
        marginTop: 4,
    },
    btnNewTaller: {
        backgroundColor: '#00d97e',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#00d97e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    btnNewTallerTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    btnNewTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnNewSub: {
        color: '#ffffff',
        fontSize: 11,
        opacity: 0.9,
        marginTop: 2,
    },
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 20,
        gap: 12,
    },
    kpiCard: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        minWidth: '30%',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    kpiIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    kpiValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    kpiLabel: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },
    talleresHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    verHistorial: {
        color: '#00d97e',
        fontSize: 13,
        fontWeight: '500',
    },
    tallerCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    statusBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    tallerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
        paddingRight: 70,
    },
    tallerLugar: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 12,
    },
    tallerDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    tallerDetailText: {
        fontSize: 12,
        color: '#555555',
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        marginHorizontal: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginTop: 12,
    },
    emptyText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center',
    },
    emptyButton: {
        backgroundColor: '#00d97e',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 20,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default DocenteHomeScreen;