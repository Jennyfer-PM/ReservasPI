import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, 
    Modal, Alert, ActivityIndicator, FlatList, ScrollView,
    Platform  // ← Importación agregada
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

const EditarPerfilComponents = ({ visible, onClose, userData, onUpdate, tipoUsuario = 'alumno' }) => {
    const [telefono, setTelefono] = useState(userData?.telefono || "");
    const [cargando, setCargando] = useState(false);
    const [carrera, setCarrera] = useState(userData?.carrera || "");
    const [departamentos, setDepartamentos] = useState([]);
    const [areasAdscripcion, setAreasAdscripcion] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [selectedAreaAdscripcion, setSelectedAreaAdscripcion] = useState(null);
    const [cargo, setCargo] = useState(userData?.cargo || "");
    const [especialidad, setEspecialidad] = useState(userData?.especialidad || "");
    const [showDepartamentosModal, setShowDepartamentosModal] = useState(false);
    const [showAreasModal, setShowAreasModal] = useState(false);
    const [showCarrerasModal, setShowCarrerasModal] = useState(false);
    const [cargandoDepartamentos, setCargandoDepartamentos] = useState(false);
    const [cargandoAreas, setCargandoAreas] = useState(false);
    const [carrerasList, setCarrerasList] = useState([]);
    const [cargandoCarreras, setCargandoCarreras] = useState(false);
    
    const esDocente = tipoUsuario === 'docente';
    
    useEffect(() => {
        if (visible && esDocente) {
            cargarDepartamentos();
        } else if (visible && !esDocente) {
            cargarCarreras();
        }
    }, [visible, esDocente]);
    
    const cargarDepartamentos = async () => {
        try {
            setCargandoDepartamentos(true);
            const response = await fetch(`${API_BASE_URL}/departamentos`);
            if (response.ok) {
                const data = await response.json();
                setDepartamentos(data);
            }
        } catch (error) {
            console.error("Error cargando departamentos:", error);
        } finally {
            setCargandoDepartamentos(false);
        }
    };
    
    const cargarAreasPorDepartamento = async (idDepartamento) => {
        try {
            setCargandoAreas(true);
            const response = await fetch(`${API_BASE_URL}/areas-adscripcion?id_departamento=${idDepartamento}`);
            if (response.ok) {
                const data = await response.json();
                setAreasAdscripcion(data);
            }
        } catch (error) {
            console.error("Error cargando áreas:", error);
        } finally {
            setCargandoAreas(false);
        }
    };
    
    const cargarCarreras = async () => {
        try {
            setCargandoCarreras(true);
            const response = await fetch(`${API_BASE_URL}/carreras`);
            if (response.ok) {
                const data = await response.json();
                setCarrerasList(data);
            }
        } catch (error) {
            console.error("Error cargando carreras:", error);
        } finally {
            setCargandoCarreras(false);
        }
    };
    
    const manejarGuardado = async () => {
        if (!telefono.trim()) {
            Alert.alert("Atención", "El teléfono es necesario para contactarte.");
            return;
        }
        
        if (esDocente) {
            if (!selectedDepartamento) {
                Alert.alert("Atención", "Por favor selecciona tu departamento.");
                return;
            }
            if (!selectedAreaAdscripcion) {
                Alert.alert("Atención", "Por favor selecciona tu área de adscripción.");
                return;
            }
        } else {
            if (!carrera.trim()) {
                Alert.alert("Atención", "Por favor ingresa tu carrera.");
                return;
            }
        }
        
        setCargando(true);
        
        try {
            const datosNuevos = {
                id_persona: userData?.id || userData?.id_persona,
                telefono: telefono.trim(),
            };
            
            if (!esDocente) {
                datosNuevos.carrera = carrera.trim();
            } else {
                datosNuevos.id_departamento = selectedDepartamento.id;
                datosNuevos.id_area_adscripcion = selectedAreaAdscripcion.id;
                datosNuevos.cargo = cargo.trim();
                datosNuevos.especialidad = especialidad.trim();
            }
            
            await onUpdate(datosNuevos);
            onClose();
            
        } catch (error) {
            console.error("Error en manejarGuardado:", error);
            Alert.alert("Error", "No se pudo actualizar el perfil.");
        } finally {
            setCargando(false);
        }
    };
    
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.contenedorPrincipal}>
                <View style={styles.tarjetaModal}>
                    <View style={styles.header}>
                        <Text style={styles.titulo}>Editar perfil</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.campoGrupo}>
                            <Text style={styles.etiqueta}>Nombre completo</Text>
                            <TextInput 
                                style={[styles.input, styles.inputBloqueado]} 
                                value={userData?.nombre || ""} 
                                editable={false} 
                            />
                        </View>
                        
                        <View style={styles.campoGrupo}>
                            <Text style={styles.etiqueta}>Email institucional</Text>
                            <TextInput 
                                style={[styles.input, styles.inputBloqueado]} 
                                value={userData?.email || ""} 
                                editable={false} 
                            />
                        </View>
                        
                        <View style={styles.campoGrupo}>
                            <Text style={styles.etiqueta}>Teléfono de contacto *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={telefono} 
                                onChangeText={setTelefono} 
                                keyboardType="phone-pad"
                                placeholder="Ej. 4421234567"
                                maxLength={10}
                            />
                        </View>
                        
                        {!esDocente ? (
                            <View style={styles.campoGrupo}>
                                <Text style={styles.etiqueta}>Carrera / Programa</Text>
                                <TouchableOpacity 
                                    style={styles.selectorInput}
                                    onPress={() => setShowCarrerasModal(true)}
                                >
                                    <Text style={[styles.selectorText, !carrera && styles.selectorPlaceholder]}>
                                        {carrera || "Selecciona tu carrera"}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View style={styles.campoGrupo}>
                                    <Text style={styles.etiqueta}>Número de empleado</Text>
                                    <TextInput 
                                        style={[styles.input, styles.inputBloqueado]} 
                                        value={userData?.noEmpleado || ""} 
                                        editable={false} 
                                    />
                                </View>
                                
                                <View style={styles.campoGrupo}>
                                    <Text style={styles.etiqueta}>Departamento *</Text>
                                    <TouchableOpacity 
                                        style={styles.selectorInput}
                                        onPress={() => setShowDepartamentosModal(true)}
                                    >
                                        <Text style={[styles.selectorText, !selectedDepartamento && styles.selectorPlaceholder]}>
                                            {selectedDepartamento?.nombre || "Selecciona tu departamento"}
                                        </Text>
                                        <Ionicons name="chevron-down" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.campoGrupo}>
                                    <Text style={styles.etiqueta}>Área de adscripción *</Text>
                                    <TouchableOpacity 
                                        style={[styles.selectorInput, !selectedDepartamento && styles.selectorDisabled]}
                                        onPress={() => selectedDepartamento && setShowAreasModal(true)}
                                        disabled={!selectedDepartamento}
                                    >
                                        <Text style={[styles.selectorText, (!selectedAreaAdscripcion || !selectedDepartamento) && styles.selectorPlaceholder]}>
                                            {selectedAreaAdscripcion?.nombre || 
                                             (selectedDepartamento ? "Selecciona tu área" : "Primero selecciona un departamento")}
                                        </Text>
                                        <Ionicons name="chevron-down" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.campoGrupo}>
                                    <Text style={styles.etiqueta}>Cargo</Text>
                                    <TextInput 
                                        style={styles.input}
                                        value={cargo}
                                        onChangeText={setCargo}
                                        placeholder="Ej. Docente de Tiempo Completo"
                                    />
                                </View>
                                
                                <View style={styles.campoGrupo}>
                                    <Text style={styles.etiqueta}>Especialidad</Text>
                                    <TextInput 
                                        style={styles.input}
                                        value={especialidad}
                                        onChangeText={setEspecialidad}
                                        placeholder="Ej. Desarrollo Web, Redes"
                                    />
                                </View>
                            </>
                        )}
                        
                        <View style={styles.filaBotones}>
                            <TouchableOpacity style={styles.botonCancelar} onPress={onClose}>
                                <Text style={styles.textoCancelar}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.botonGuardar, cargando && styles.botonDisabled]}
                                onPress={manejarGuardado}
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.textoGuardar}>Guardar cambios</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
            
            {/* Modales */}
            <Modal visible={showDepartamentosModal} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar departamento</Text>
                            <TouchableOpacity onPress={() => setShowDepartamentosModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        {cargandoDepartamentos ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#00d97e" />
                            </View>
                        ) : (
                            <FlatList
                                data={departamentos}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.modalItem, selectedDepartamento?.id === item.id && styles.modalItemActive]}
                                        onPress={() => {
                                            setSelectedDepartamento(item);
                                            setSelectedAreaAdscripcion(null);
                                            cargarAreasPorDepartamento(item.id);
                                            setShowDepartamentosModal(false);
                                        }}
                                    >
                                        <Text style={[styles.modalItemText, selectedDepartamento?.id === item.id && styles.modalItemTextActive]}>
                                            {item.nombre}
                                        </Text>
                                        {selectedDepartamento?.id === item.id && (
                                            <Ionicons name="checkmark-circle" size={24} color="#00d97e" />
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
            
            <Modal visible={showAreasModal} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar área</Text>
                            <TouchableOpacity onPress={() => setShowAreasModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        {cargandoAreas ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#00d97e" />
                            </View>
                        ) : (
                            <FlatList
                                data={areasAdscripcion}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.modalItem, selectedAreaAdscripcion?.id === item.id && styles.modalItemActive]}
                                        onPress={() => {
                                            setSelectedAreaAdscripcion(item);
                                            setShowAreasModal(false);
                                        }}
                                    >
                                        <Text style={[styles.modalItemText, selectedAreaAdscripcion?.id === item.id && styles.modalItemTextActive]}>
                                            {item.nombre}
                                        </Text>
                                        {selectedAreaAdscripcion?.id === item.id && (
                                            <Ionicons name="checkmark-circle" size={24} color="#00d97e" />
                                        )}
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.modalEmptyContainer}>
                                        <Text style={styles.modalEmptyTitle}>No hay áreas disponibles</Text>
                                    </View>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
            
            <Modal visible={showCarrerasModal} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar carrera</Text>
                            <TouchableOpacity onPress={() => setShowCarrerasModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        {cargandoCarreras ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#00d97e" />
                            </View>
                        ) : (
                            <FlatList
                                data={carrerasList}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setCarrera(item.nombre);
                                            setShowCarrerasModal(false);
                                        }}
                                    >
                                        <Text style={styles.modalItemText}>{item.nombre}</Text>
                                        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    contenedorPrincipal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    tarjetaModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    campoGrupo: {
        marginBottom: 20,
    },
    etiqueta: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#1E293B',
        backgroundColor: '#FFFFFF',
    },
    inputBloqueado: {
        backgroundColor: '#F8FAFC',
        color: '#94A3B8',
    },
    selectorInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#FFFFFF',
    },
    selectorDisabled: {
        backgroundColor: '#F8FAFC',
        opacity: 0.7,
    },
    selectorText: {
        fontSize: 15,
        color: '#1E293B',
        flex: 1,
    },
    selectorPlaceholder: {
        color: '#94A3B8',
    },
    filaBotones: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    botonCancelar: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    botonGuardar: {
        flex: 2,
        backgroundColor: '#00d97e',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    botonDisabled: {
        opacity: 0.7,
    },
    textoCancelar: {
        color: '#64748B',
        fontWeight: '600',
        fontSize: 14,
    },
    textoGuardar: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalItemActive: {
        backgroundColor: '#F0FDF4',
    },
    modalItemText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1E293B',
    },
    modalItemTextActive: {
        color: '#00d97e',
    },
    modalEmptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    modalEmptyTitle: {
        fontSize: 16,
        color: '#64748B',
    },
    loaderContainer: {
        padding: 40,
        alignItems: 'center',
    },
});

export default EditarPerfilComponents;