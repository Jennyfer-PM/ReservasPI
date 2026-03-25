import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';
import { API_BASE_URL } from '../constants/api'; 

const EditarPerfilScreen = ({ navigation, route }) => {
    const { usuario, idUsuario } = route.params;
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleGuardarCambios = async () => {
        if (contrasena && contrasena !== confirmarContrasena) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }

        if (!telefono && !contrasena) {
            Alert.alert("Atención", "Debes llenar al menos un campo para actualizar.");
            return;
        }

        try {
            setCargando(true);
            const response = await fetch(`${API_BASE_URL}/usuario/actualizar`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_persona: idUsuario,
                    telefono: telefono || null,
                    contrasena: contrasena || null, 
                }),
            });

            const json = await response.json();

            if (response.ok) {
                Alert.alert("Éxito", "Tu perfil ha sido actualizado.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Error", json.detail || "No se pudo actualizar el perfil.");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Header userName={usuario} role="Alumno" isWeb={false} navigation={navigation} />
            
            <ScrollView contentContainerStyle={styles.scrollInner}>
                <View style={styles.mobilePadding}>
                    
                    <View style={styles.headerSection}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#1e293b" />
                        </TouchableOpacity>
                        <Text style={styles.mainTitle}>Editar Perfil</Text>
                    </View>

                    {/* SECCIÓN DE TELÉFONO */}
                    <Text style={styles.sectionTitle}>Teléfono de contacto</Text>
                    <View style={styles.inputCard}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={20} color="#94a3b8" />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Nuevo teléfono (ej. 4421234567)"
                                value={telefono}
                                onChangeText={setTelefono}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* SECCIÓN DE CONTRASEÑA */}
                    <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Cambiar contraseña</Text>
                    <View style={styles.inputCard}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Nueva contraseña"
                                value={contrasena}
                                onChangeText={setContrasena}
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={[styles.inputWrapper, { borderBottomWidth: 0 }]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Confirmar nueva contraseña"
                                value={confirmarContrasena}
                                onChangeText={setConfirmarContrasena}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    {/* BOTÓN GUARDAR */}
                    <TouchableOpacity 
                        style={[styles.saveButton, cargando && { opacity: 0.7 }]} 
                        onPress={handleGuardarCambios}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Guardar cambios</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollInner: {
        paddingTop: 10,
    },
    mobilePadding: {
        paddingHorizontal: 20,
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    backButton: {
        marginRight: 10,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 5,
    },
    inputCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: '#2563eb',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
        elevation: 3,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default EditarPerfilScreen;