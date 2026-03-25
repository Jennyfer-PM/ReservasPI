import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/formularioReservaStyles';

const IMAGENES_ESPACIOS = {
    'Laboratorios': require('../../assets/laboratorio.jpg'),
    'Salas de Cómputo': require('../../assets/salacomputo.jpg'),
    'Auditorios': require('../../assets/auditorio.jpg'),
    'Biblioteca': require('../../assets/biblioteca.jpg'),
    'Salas': require('../../assets/sala.jpg'),
    'Talleres': require('../../assets/taller.jpg'),
    'Salones': require('../../assets/salon.jpg'),
    'Default': require('../../assets/laboratorio.jpg'),
};

const FormularioReserva = ({ route, navigation }) => {
    const { width } = useWindowDimensions();
    const isWeb = width > 768;
    const { espacio } = route.params || {}; 
    
    const [fechaSel, setFechaSel] = useState('Dom, 22 Feb');
    const [proposito, setProposito] = useState('');
    const [asistentes, setAsistentes] = useState('');
    const [status, setStatus] = useState('idle');

    const fechas = ['Dom, 22 Feb', 'Lun, 23 Feb', 'Mar, 24 Feb', 'Mié, 25 Feb'];

    const handleConfirmar = () => {
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => navigation.goBack(), 3000);
        }, 1500);
    };

    if (status === 'success') {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ alignItems: 'center', padding: 30 }}>
                    <View style={{ backgroundColor: '#dcfce7', padding: 20, borderRadius: 50, marginBottom: 20 }}>
                        <Ionicons name="checkmark" size={50} color="#22c55e" />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>¡Reserva confirmada!</Text>
                    <Text style={{ color: '#64748b', marginTop: 10, textAlign: 'center' }}>Tu solicitud ha sido enviada con éxito.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={20} color="#64748b" />
                    <Text style={{ fontSize: 16, color: '#64748b', marginLeft: 8 }}>Volver</Text>
                </TouchableOpacity>

                {/* CONTENEDOR RESPONSIVO: 'row' para PC, 'column' para Celular */}
                <View style={{ 
                    flexDirection: isWeb ? 'row' : 'column', 
                    padding: isWeb ? 20 : 15,
                    gap: 20 
                }}>
                    
                    {/* INFO DEL ESPACIO */}
                    <View style={{ flex: isWeb ? 1.2 : 0 }}>
                        <Image 
                            source={IMAGENES_ESPACIOS[espacio?.tipo] || IMAGENES_ESPACIOS['Default']} 
                            style={{ width: '100%', height: isWeb ? 400 : 250, borderRadius: 20 }} 
                        />
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase', fontSize: 12 }}>{espacio?.tipo}</Text>
                            <Text style={{ fontSize: 28, fontWeight: 'bold', marginVertical: 5 }}>{espacio?.nombre}</Text>
                            <Text style={{ color: '#64748b' }}>{espacio?.ubicacion} • Planta 1</Text>
                            
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Descripción</Text>
                            <Text style={{ color: '#64748b', marginTop: 8, lineHeight: 20 }}>
                                Espacio optimizado para actividades académicas con capacidad de {espacio?.capacidad} personas.
                            </Text>
                        </View>
                    </View>

                    {/* FORMULARIO */}
                    <View style={{ 
                        flex: 1, 
                        backgroundColor: '#fff', 
                        padding: 25, 
                        borderRadius: 20, 
                        elevation: 4,
                        marginBottom: 30
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Solicitar reserva</Text>
                        
                        <Text style={styles.label}>Fecha de uso</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                            {fechas.map(f => (
                                <TouchableOpacity 
                                    key={f} 
                                    style={[styles.fechaBtn, fechaSel === f && { backgroundColor: '#1e293b' }]}
                                    onPress={() => setFechaSel(f)}
                                >
                                    <Text style={{ color: fechaSel === f ? '#fff' : '#64748b', fontSize: 12 }}>{f}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Propósito *</Text>
                        <TextInput style={styles.input} value={proposito} onChangeText={setProposito} placeholder="Ej. Clase de Redes" />

                        <Text style={styles.label}>Asistentes *</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={asistentes} onChangeText={setAsistentes} placeholder="Cant." />

                        <TouchableOpacity 
                            style={[styles.btnConfirmar, { backgroundColor: '#1e293b', marginTop: 10 }]} 
                            onPress={handleConfirmar}
                        >
                            <Text style={styles.btnText}>Confirmar reserva</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default FormularioReserva;