import React, { useState, useEffect } from 'react';
import { 
    Modal, View, Text, StyleSheet, TouchableOpacity, 
    FlatList, ActivityIndicator, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const HistorialReservasComponents = ({ visible, onClose, idUsuario }) => {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [anio, setAnio] = useState(2026);

    const fetchHistorial = async () => {
        setCargando(true);
        try {
            const response = await fetch(
                `http://192.168.100.95:8000/api/reservas/usuario/${idUsuario}?mes=${mes}&anio=${anio}`
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
            case 'autorizada': return '#16a34a';
            case 'pendiente': return '#ca8a04';
            case 'rechazada': return '#dc2626';
            default: return '#64748b';
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Historial de reservas</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {/* Filtros */}
                    <View style={styles.filters}>
                        <Picker
                            selectedValue={mes}
                            style={{ flex: 1 }}
                            onValueChange={(itemValue) => setMes(itemValue)}
                        >
                            <Picker.Item label="Enero" value={1} />
                            <Picker.Item label="Febrero" value={2} />
                            <Picker.Item label="Marzo" value={3} />
                            <Picker.Item label="Abril" value={4} />
                            <Picker.Item label="Mayo" value={5} />
                            <Picker.Item label="Junio" value={6} />
                            <Picker.Item label="Julio" value={7} />
                            <Picker.Item label="Agosto" value={8} />
                            <Picker.Item label="Septiembre" value={9} />
                            <Picker.Item label="Octubre" value={10} />
                            <Picker.Item label="Noviembre" value={11} />
                            <Picker.Item label="Diciembre" value={12} />
                        </Picker>
                        <Picker
                            selectedValue={anio}
                            style={{ flex: 1 }}
                            onValueChange={(itemValue) => setAnio(itemValue)}
                        >
                            <Picker.Item label="2026" value={2026} />
                            <Picker.Item label="2025" value={2025} />
                        </Picker>
                    </View>

                    {cargando ? (
                        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={reservas}
                            keyExtractor={(item) => item.id_reserva.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.eventTitle}>{item.nombre_evento}</Text>
                                        <View style={[styles.badge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
                                            <Text style={[styles.badgeText, { color: getEstadoColor(item.estado) }]}>
                                                {item.estado}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="business-outline" size={16} color="#64748b" />
                                        <Text style={styles.infoText}>{item.nombre_espacio}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="calendar-outline" size={16} color="#64748b" />
                                        <Text style={styles.infoText}>{item.fecha} • {item.hora_inicio}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="timer-outline" size={16} color="#64748b" />
                                        <Text style={styles.infoText}>Duración: {item.duracion}</Text>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No hay reservas para este periodo.</Text>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    container: { backgroundColor: '#fff', height: '85%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    filters: { flexDirection: 'row', marginBottom: 15, borderBottomWidth: 1, borderColor: '#f1f5f9' },
    card: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    eventTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 12, fontWeight: '700' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    infoText: { marginLeft: 8, color: '#64748b', fontSize: 14 },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#94a3b8' }
});

export default HistorialReservasComponents;