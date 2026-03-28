import React, { useState, useEffect } from 'react';
import { 
    Modal, View, Text, StyleSheet, TouchableOpacity, 
    FlatList, ActivityIndicator, Dimensions, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL } from '../constants/api';

const { width, height } = Dimensions.get('window');

const HistorialReservasComponents = ({ visible, onClose, idUsuario }) => {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [anio, setAnio] = useState(new Date().getFullYear());

    const fetchHistorial = async () => {
        setCargando(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/reservas/usuario/${idUsuario}?mes=${mes}&anio=${anio}`
            );
            const data = await response.json();
            setReservas(data);
        } catch (error) {
            console.error("Error historial:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (visible) fetchHistorial();
    }, [visible, mes, anio]);

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'autorizada': return '#10B981';
            case 'pendiente': return '#F59E0B';
            case 'rechazada': return '#EF4444';
            default: return '#64748B';
        }
    };

    const getEstadoBgColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'autorizada': return '#E8F5E9';
            case 'pendiente': return '#FFF3E0';
            case 'rechazada': return '#FFEBEE';
            default: return '#F5F5F5';
        }
    };

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const años = [2024, 2025, 2026, 2027];

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Historial de reservas</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Filtros */}
                    <View style={styles.filters}>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Mes</Text>
                            <Picker
                                selectedValue={mes}
                                style={styles.picker}
                                onValueChange={(itemValue) => setMes(itemValue)}
                            >
                                {meses.map((m, index) => (
                                    <Picker.Item key={index} label={m} value={index + 1} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Año</Text>
                            <Picker
                                selectedValue={anio}
                                style={styles.picker}
                                onValueChange={(itemValue) => setAnio(itemValue)}
                            >
                                {años.map((a) => (
                                    <Picker.Item key={a} label={a.toString()} value={a} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {cargando ? (
                        <ActivityIndicator size="large" color="#00d97e" style={styles.loader} />
                    ) : (
                        <FlatList
                            data={reservas}
                            keyExtractor={(item) => item.id_reserva?.toString() || Math.random().toString()}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.eventTitle}>{item.nombre_evento}</Text>
                                        <View style={[styles.badge, { backgroundColor: getEstadoBgColor(item.estado) }]}>
                                            <Text style={[styles.badgeText, { color: getEstadoColor(item.estado) }]}>
                                                {item.estado}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="business-outline" size={16} color="#64748B" />
                                        <Text style={styles.infoText}>{item.nombre_espacio}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="calendar-outline" size={16} color="#64748B" />
                                        <Text style={styles.infoText}>{item.fecha} • {item.hora_inicio}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="timer-outline" size={16} color="#64748B" />
                                        <Text style={styles.infoText}>Duración: {item.duracion}</Text>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
                                    <Text style={styles.emptyText}>
                                        No hay reservas para este periodo
                                    </Text>
                                    <Text style={styles.emptySubtext}>
                                        {meses[mes - 1]} {anio}
                                    </Text>
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        height: '85%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.1)',
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    pickerContainer: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
        fontWeight: '500',
    },
    picker: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    loader: {
        marginTop: 40,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#64748B',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#64748B',
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 4,
    },
});

export default HistorialReservasComponents;