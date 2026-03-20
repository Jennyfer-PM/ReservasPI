import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';

const DetalleEspacioScreen = ({ route, navigation }) => {
    const { id, titulo, edificio, capacidad, ubicacion } = route.params || {};

    const [asistentes, setAsistentes] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleConfirmar = async () => {
        if (!asistentes) {
            Alert.alert("Error", "Ingresa el número de asistentes");
            return;
        }
        setEnviando(true);
        setTimeout(() => {
            setEnviando(false);
            Alert.alert("Éxito", "Reserva enviada");
            navigation.goBack();
        }, 1500);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header userName="Axel Romo" role="Alumno" />
            <ScrollView style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="chevron-back" size={24} color="#4a5568" />
                    <Text>Volver</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>{titulo}</Text>
                <Text style={{ color: '#718096' }}>{edificio} - {ubicacion}</Text>

                <View style={{ marginTop: 30 }}>
                    <Text>Asistentes (Máximo: {capacidad})</Text>
                    <TextInput 
                        style={{ borderBottomWidth: 1, padding: 10, marginBottom: 20 }}
                        keyboardType="numeric"
                        placeholder="Ej. 15"
                        value={asistentes}
                        onChangeText={setAsistentes}
                    />
                    
                    <TouchableOpacity 
                        onPress={handleConfirmar}
                        style={{ backgroundColor: '#00d97e', padding: 15, borderRadius: 10, alignItems: 'center' }}
                    >
                        {enviando ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmar Reserva</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default DetalleEspacioScreen;