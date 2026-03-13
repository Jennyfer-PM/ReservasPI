import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import misTalleresStyles from '../styles/misTalleresStyles';
import homeStyles from '../styles/alumnoHomeStyles'; // Import para Header consistente

const BREAKPOINT = 768;

const misTalleresScreen = ({ navigation }) => {
    const [filtroEstado, setFiltroEstado] = useState('Todas (7)');
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const solicitudes = [
        { id: 1, titulo: 'Laboratorio de Cómputo A', edificio: 'Edificio de Ingeniería', tipo: 'Taller práctico', fecha: 'Martes, 24 De Febrero', horario: '14:00 - 17:00', asistentes: '28 asistentes', estado: 'Aprobada', imagen: require('../../assets/salacomputo.jpg') },
        { id: 2, titulo: 'Auditorio Principal', edificio: 'Edificio Central', tipo: 'Conferencia', fecha: 'Viernes, 27 De Febrero', horario: '10:00 - 12:00', asistentes: '245 asistentes', estado: 'Aprobada', imagen: require('../../assets/auditorio.jpg') },
        { id: 3, titulo: 'Laboratorio de Química General', edificio: 'Edificio de Ciencias', tipo: 'Laboratorio', fecha: 'Miércoles, 4 De Marzo', horario: '09:00 - 11:00', asistentes: '15 asistentes', estado: 'Pendiente', imagen: require('../../assets/laboratorio.jpg') },
    ];

    const stats = [
        { label: 'Pendientes', count: 1, color: '#FFB347', icon: 'time-outline' },
        { label: 'Aprobadas', count: 2, color: '#00C853', icon: 'checkmark-circle-outline' },
        { label: 'Rechazadas', count: 2, color: '#FF3B30', icon: 'close-circle-outline' },
        { label: 'Completadas', count: 2, color: '#2979FF', icon: 'document-text-outline' },
    ];

    const isWebLayout = windowWidth > BREAKPOINT;

    return (
        <View style={misTalleresStyles.mainContainer}>
            {/* HEADER UNIFICADO */}
            <View style={homeStyles.header}>
                <View style={homeStyles.headerLeft}>
                    <Image source={require('../../assets/icon PI.png')} style={homeStyles.logoPI} />
                    <View>
                        <Text style={homeStyles.brandName}>SistemaReservas</Text>
                        <Text style={homeStyles.brandSub}>Universidad</Text>
                    </View>
                </View>

                {isWebLayout && (
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Inicio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Espacios')}> 
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Espacios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Mis Talleres')}>
                            <Text style={{ fontWeight: '600', color: '#00d97e' }}>Mis Talleres</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Perfil</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={homeStyles.profileSection}>
                    <View style={{ position: 'relative' }}>
                        <Ionicons name="notifications-outline" size={22} color="#495057" />
                        <View style={homeStyles.notifBadge}>
                            <Text style={{color: '#FFF', fontSize: 8, fontWeight: 'bold'}}>2</Text>
                        </View>
                    </View>
                    {isWebLayout && (
                        <View style={homeStyles.userInfo}>
                            <Text style={homeStyles.userName}>Ana Martínez</Text>
                            <Text style={homeStyles.userRole}>Alumno</Text>
                        </View>
                    )}
                    <View style={homeStyles.avatar}><Text style={homeStyles.avatarText}>AM</Text></View>
                </View>
            </View>

            <ScrollView style={misTalleresStyles.contentScroll}>
                <View style={isWebLayout ? misTalleresStyles.centeredContentWeb : misTalleresStyles.mobilePadding}>
                    <Text style={misTalleresStyles.mainTitle}>Mis solicitudes</Text>
                    <Text style={misTalleresStyles.subTitle}>Gestiona y revisa el estado de tus reservas de espacios</Text>

                    <View style={misTalleresStyles.statsGrid}>
                        {stats.map((item, index) => (
                            <View key={index} style={[misTalleresStyles.statCard, { backgroundColor: item.color }]}>
                                <View style={misTalleresStyles.statHeader}>
                                    <Ionicons name={item.icon} size={20} color="#FFF" />
                                    <Text style={misTalleresStyles.statLabel}>{item.label}</Text>
                                </View>
                                <Text style={misTalleresStyles.statCount}>{item.count}</Text>
                            </View>
                        ))}
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={misTalleresStyles.filterScroll}>
                        {['Todas (7)', 'Pendientes (1)', 'Aprobadas (2)', 'Rechazadas (2)', 'Completadas (2)'].map((filter) => (
                            <TouchableOpacity 
                                key={filter} 
                                style={[misTalleresStyles.filterChip, filtroEstado === filter && misTalleresStyles.filterChipActive]}
                                onPress={() => setFiltroEstado(filter)}
                            >
                                <Text style={[misTalleresStyles.filterText, filtroEstado === filter && misTalleresStyles.filterTextActive]}>{filter}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={misTalleresStyles.listContainer}>
                        {solicitudes.map((item) => (
                            <View key={item.id} style={misTalleresStyles.solicitudCard}>
                                <Image source={item.imagen} style={misTalleresStyles.cardImage} />
                                <View style={misTalleresStyles.cardInfo}>
                                    <View style={misTalleresStyles.cardHeader}>
                                        <Text style={misTalleresStyles.cardTitle}>{item.titulo}</Text>
                                        <View style={[misTalleresStyles.statusBadge, { backgroundColor: item.estado === 'Aprobada' ? '#E8F5E9' : '#FFF3E0' }]}>
                                            <Text style={[misTalleresStyles.statusText, { color: item.estado === 'Aprobada' ? '#2E7D32' : '#EF6C00' }]}>{item.estado}</Text>
                                        </View>
                                    </View>
                                    <Text style={misTalleresStyles.cardSubtitle}>{item.edificio}</Text>
                                    <View style={misTalleresStyles.detailRow}><Ionicons name="copy-outline" size={14} color="#666" /><Text style={misTalleresStyles.detailText}>{item.tipo}</Text></View>
                                    <View style={misTalleresStyles.detailRow}><Ionicons name="calendar-outline" size={14} color="#666" /><Text style={misTalleresStyles.detailText}>{item.fecha}</Text></View>
                                    <View style={misTalleresStyles.detailRow}><Ionicons name="time-outline" size={14} color="#666" /><Text style={misTalleresStyles.detailText}>{item.horario}</Text></View>
                                    <View style={misTalleresStyles.detailRow}><Ionicons name="people-outline" size={14} color="#666" /><Text style={misTalleresStyles.detailText}>{item.asistentes}</Text></View>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={misTalleresStyles.infoSection}>
                        <Text style={misTalleresStyles.infoSectionTitle}>Estados de las solicitudes</Text>
                        <Text style={misTalleresStyles.infoRow}><Text style={{fontWeight: 'bold', color: '#EF6C00'}}>Pendiente:</Text> Tu solicitud está siendo revisada.</Text>
                        <Text style={misTalleresStyles.infoRow}><Text style={{fontWeight: 'bold', color: '#2E7D32'}}>Aprobada:</Text> Tu reserva ha sido confirmada.</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default misTalleresScreen;