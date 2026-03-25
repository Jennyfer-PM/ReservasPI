import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import misTalleresStyles from '../styles/misTalleresStyles';
import Header from '../components/header'; 
import { API_BASE_URL } from '../constants/api'; 

const BREAKPOINT = 768;

const MisTalleresScreen = ({ navigation, route }) => {
    const [filtroEstado, setFiltroEstado] = useState('Todas');
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { usuario, idUsuario } = route.params || { usuario: 'Usuario', idUsuario: null };

    useEffect(() => {
        obtenerReservas();
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const obtenerReservas = async () => {
        try {
            setCargando(true);
            const response = await fetch(`${API_BASE_URL}/reservas`);
            const data = await response.json();
            setSolicitudes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener reservas:", error);
            setSolicitudes([]);
        } finally {
            setCargando(false);
        }
    };

    const conteos = {
        Todas: solicitudes.length,
        Pendientes: solicitudes.filter(s => s.estado === 'Pendiente').length,
        Aprobadas: solicitudes.filter(s => s.estado === 'Aprobada').length,
        Rechazadas: solicitudes.filter(s => s.estado === 'Rechazada').length,
    };

    const isWebLayout = windowWidth > BREAKPOINT;

    const obtenerSolicitudesFiltradas = () => {
        if (filtroEstado === 'Todas') return solicitudes;
        const mapaEstados = { 
            'Pendientes': 'Pendiente', 
            'Aprobadas': 'Aprobada', 
            'Rechazadas': 'Rechazada' 
        };
        return solicitudes.filter(item => item.estado === mapaEstados[filtroEstado]);
    };

    const getStatusStyle = (estado) => {
        switch (estado) {
            case 'Aprobada': return { bg: '#E8F5E9', text: '#2E7D32' };
            case 'Rechazada': return { bg: '#FFEBEE', text: '#C62828' };
            case 'Pendiente': return { bg: '#FFF3E0', text: '#EF6C00' };
            default: return { bg: '#F5F5F5', text: '#616161' };
        }
    };

    return (
        <View style={misTalleresStyles.mainContainer}>
            <Header userName={usuario} role="Alumno" isWeb={isWebLayout} />

            <ScrollView 
                style={misTalleresStyles.contentScroll}
                contentContainerStyle={!isWebLayout && { paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={isWebLayout ? misTalleresStyles.centeredContentWeb : misTalleresStyles.mobilePadding}>
                    <Text style={misTalleresStyles.mainTitle}>Mis solicitudes</Text>
                    <Text style={misTalleresStyles.subTitle}>Gestiona y revisa el estado de tus reservas</Text>

                    {/* SECCIÓN DE CUADRADOS - CON SCROLL HORIZONTAL */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={{ marginTop: 20, paddingBottom: 10 }}
                    >
                        {[
                            { label: 'Todas', count: conteos.Todas, icon: 'list' },
                            { label: 'Pendientes', count: conteos.Pendientes, icon: 'time' },
                            { label: 'Aprobadas', count: conteos.Aprobadas, icon: 'checkmark-circle' },
                            { label: 'Rechazadas', count: conteos.Rechazadas, icon: 'close-circle' }
                        ].map((item) => (
                            <TouchableOpacity 
                                key={item.label} 
                                activeOpacity={0.8}
                                onPress={() => setFiltroEstado(item.label)}
                                style={{ 
                                    width: 110, 
                                    backgroundColor: '#fff', 
                                    padding: 15, 
                                    borderRadius: 16, 
                                    alignItems: 'center',
                                    marginRight: 12,
                                    elevation: 4,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    borderBottomWidth: 3,
                                    borderBottomColor: '#00d97e'
                                }}
                            >
                                <Ionicons name={item.icon} size={22} color="#00d97e" style={{ marginBottom: 5 }} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b' }}>{item.count}</Text>
                                <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {cargando ? (
                        <ActivityIndicator size="large" color="#00d97e" style={{ marginTop: 50 }} />
                    ) : (
                        <>
                            {/* Chips de Filtro - Scrollable */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[misTalleresStyles.filterScroll, { marginTop: 25 }]}>
                                {['Todas', 'Pendientes', 'Aprobadas', 'Rechazadas'].map((filter) => (
                                    <TouchableOpacity 
                                        key={filter} 
                                        style={[
                                            misTalleresStyles.filterChip, 
                                            filtroEstado === filter && { backgroundColor: '#1e293b', borderColor: '#1e293b' }
                                        ]}
                                        onPress={() => setFiltroEstado(filter)}
                                    >
                                        <Text style={[misTalleresStyles.filterText, filtroEstado === filter && { color: '#fff' }]}>{filter}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Lista de Solicitudes */}
                            <View style={misTalleresStyles.listContainer}>
                                {obtenerSolicitudesFiltradas().length > 0 ? (
                                    obtenerSolicitudesFiltradas().map((item) => {
                                        const statusStyle = getStatusStyle(item.estado);
                                        return (
                                            <View key={item.id} style={misTalleresStyles.solicitudCard}>
                                                <View style={misTalleresStyles.cardInfo}>
                                                    <View style={misTalleresStyles.cardHeader}>
                                                        <Text style={misTalleresStyles.cardTitle}>{item.espacio_nombre || "Espacio Académico"}</Text>
                                                        <View style={[misTalleresStyles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                                            <Text style={[misTalleresStyles.statusText, { color: statusStyle.text }]}>{item.estado}</Text>
                                                        </View>
                                                    </View>
                                                    
                                                    <Text style={misTalleresStyles.cardSubtitle}>{item.proposito || "Sin propósito especificado"}</Text>
                                                    
                                                    <View style={misTalleresStyles.cardFooter}>
                                                        <View style={misTalleresStyles.detailRow}>
                                                            <Ionicons name="calendar-outline" size={14} color="#666" />
                                                            <Text style={misTalleresStyles.detailText}>{item.fecha}</Text>
                                                        </View>
                                                        <View style={misTalleresStyles.detailRow}>
                                                            <Ionicons name="location-outline" size={14} color="#666" />
                                                            <Text style={misTalleresStyles.detailText}>UPQ</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })
                                ) : (
                                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                                        <Ionicons name="document-text-outline" size={50} color="#ccc" />
                                        <Text style={{ color: '#999', marginTop: 10 }}>No hay solicitudes en este estado</Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default MisTalleresScreen;