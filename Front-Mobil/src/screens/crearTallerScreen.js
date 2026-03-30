import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TextInput, TouchableOpacity,
    SafeAreaView, StyleSheet, Alert, ActivityIndicator, Dimensions,
    Modal, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/header';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');

const CrearTallerScreen = ({ navigation, route }) => {
    const { usuario, idUsuario } = route.params || {};
    
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [idEspacio, setIdEspacio] = useState(null);
    const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
    const [fecha, setFecha] = useState(new Date());
    const [horaInicio, setHoraInicio] = useState(new Date());
    const [duracionHoras, setDuracionHoras] = useState('1');
    const [duracionMinutos, setDuracionMinutos] = useState('30');
    const [espacios, setEspacios] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showEspaciosModal, setShowEspaciosModal] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [cargandoEspacios, setCargandoEspacios] = useState(true);
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');

    const categorias = [
        'Todos', 'Laboratorios', 'Salas de Cómputo', 'Auditorios', 
        'Biblioteca', 'Salas', 'Talleres', 'Salones'
    ];

    useEffect(() => {
        cargarEspacios();
    }, []);

    const cargarEspacios = async () => {
        try {
            setCargandoEspacios(true);
            const response = await fetch(`${API_BASE_URL}/espacios`);
            const data = await response.json();
            setEspacios(data);
        } catch (error) {
            console.error("Error cargando espacios:", error);
            Alert.alert("Error", "No se pudieron cargar los espacios");
        } finally {
            setCargandoEspacios(false);
        }
    };

    const espaciosFiltrados = espacios.filter(esp => {
        const coincideCategoria = filtroCategoria === 'Todos' || esp.tipo === filtroCategoria;
        const coincideBusqueda = esp.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
                                  esp.ubicacion.toLowerCase().includes(filtroBusqueda.toLowerCase());
        return coincideCategoria && coincideBusqueda;
    });

    const obtenerIdDocente = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuario/docente/${idUsuario}`);
            if (response.ok) {
                const data = await response.json();
                return data.id;
            }
            return null;
        } catch (error) {
            console.error("Error obteniendo ID docente:", error);
            return null;
        }
    };

    const handleCrearTaller = async () => {
        if (!titulo.trim()) {
            Alert.alert('Error', 'Por favor ingresa el título del taller');
            return;
        }
        if (!idEspacio) {
            Alert.alert('Error', 'Por favor selecciona un espacio');
            return;
        }
        
        const fechaStr = fecha.toISOString().split('T')[0];
        const horaStr = `${horaInicio.getHours().toString().padStart(2, '0')}:${horaInicio.getMinutes().toString().padStart(2, '0')}`;
        const horas = parseInt(duracionHoras) || 1;
        const minutos = parseInt(duracionMinutos) || 0;

        setCargando(true);
        
        try {
            const docenteId = await obtenerIdDocente();
            if (!docenteId) {
                throw new Error('No se pudo identificar al docente');
            }
            
            const params = new URLSearchParams({
                id_docente: docenteId,
                nombre: titulo,
                id_espacio: idEspacio,
                fecha: fechaStr,
                hora_inicio: horaStr,
                duracion_horas: horas,
                duracion_minutos: minutos,
                detalles: descripcion
            });
            
            const response = await fetch(`${API_BASE_URL}/docente/taller/crear?${params.toString()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                Alert.alert(
                    '¡Taller Creado!',
                    `El taller "${titulo}" ha sido creado exitosamente.`,
                    [
                        { 
                            text: 'Aceptar', 
                            onPress: () => {
                                navigation.goBack();
                            }
                        }
                    ]
                );
            } else {
                let errorMessage = data.detail || 'No se pudo crear el taller';
                
                if (response.status === 409) {
                    errorMessage = 'El espacio no está disponible en ese horario. Por favor elige otra fecha u hora.';
                }
                
                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            console.error("Error creando taller:", error);
            Alert.alert('Error', 'No se pudo crear el taller. Verifica tu conexión.');
        } finally {
            setCargando(false);
        }
    };

    const EspacioSelectorModal = () => (
        <Modal visible={showEspaciosModal} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Seleccionar espacio</Text>
                        <TouchableOpacity onPress={() => setShowEspaciosModal(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar espacio..."
                            placeholderTextColor="#94A3B8"
                            value={filtroBusqueda}
                            onChangeText={setFiltroBusqueda}
                        />
                    </View>

                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.categoriesScroll}
                        contentContainerStyle={styles.categoriesContent}
                    >
                        {categorias.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryChip,
                                    filtroCategoria === cat && styles.categoryChipActive
                                ]}
                                onPress={() => setFiltroCategoria(cat)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    filtroCategoria === cat && styles.categoryTextActive
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    
                    {cargandoEspacios ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#00d97e" />
                            <Text style={styles.loaderText}>Cargando espacios...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={espaciosFiltrados}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        idEspacio === item.id && styles.modalItemActive
                                    ]}
                                    onPress={() => {
                                        setIdEspacio(item.id);
                                        setEspacioSeleccionado(item);
                                        setShowEspaciosModal(false);
                                    }}
                                >
                                    <View style={styles.modalItemContent}>
                                        <View style={styles.modalItemHeader}>
                                            <Text 
                                                numberOfLines={2}
                                                style={[
                                                    styles.modalItemText,
                                                    idEspacio === item.id && styles.modalItemTextActive
                                                ]}
                                            >
                                                {item.nombre}
                                            </Text>
                                            <View style={styles.modalItemBadge}>
                                                <Text style={styles.modalItemBadgeText}>
                                                    {item.tipo || 'Espacio'}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.modalItemSubtext}>
                                            {item.ubicacion} • Capacidad: {item.capacidad} personas
                                        </Text>
                                    </View>
                                    {idEspacio === item.id && (
                                        <Ionicons name="checkmark-circle" size={24} color="#00d97e" />
                                    )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.modalEmptyContainer}>
                                    <Ionicons name="business-outline" size={48} color="#CBD5E1" />
                                    <Text style={styles.modalEmptyTitle}>No hay espacios disponibles</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header userName={usuario} role="Docente" isWeb={false} navigation={navigation} idUsuario={idUsuario} />
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#64748B" />
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Crear Nuevo Taller</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título del taller *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Introducción a Python"
                            placeholderTextColor="#94A3B8"
                            value={titulo}
                            onChangeText={setTitulo}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Describe el contenido del taller..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={4}
                            value={descripcion}
                            onChangeText={setDescripcion}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Lugar / Espacio *</Text>
                        <TouchableOpacity 
                            style={styles.selectorInput}
                            onPress={() => setShowEspaciosModal(true)}
                        >
                            <View style={styles.selectorLeft}>
                                <Ionicons name="business-outline" size={20} color="#64748B" />
                                <Text style={[
                                    styles.selectorText, 
                                    !idEspacio && styles.selectorPlaceholder
                                ]}>
                                    {espacioSeleccionado ? espacioSeleccionado.nombre : 'Selecciona un espacio'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                        {idEspacio && espacioSeleccionado && (
                            <View style={styles.espacioInfo}>
                                <Text style={styles.espacioInfoText}>
                                    {espacioSeleccionado.ubicacion} • Capacidad: {espacioSeleccionado.capacidad} personas
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha *</Text>
                        <TouchableOpacity 
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={20} color="#64748B" />
                            <Text style={styles.dateText}>
                                {fecha.toLocaleDateString('es-MX', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Hora de inicio *</Text>
                        <TouchableOpacity 
                            style={styles.dateButton}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Ionicons name="time-outline" size={20} color="#64748B" />
                            <Text style={styles.dateText}>
                                {horaInicio.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfInput]}>
                            <Text style={styles.label}>Duración (horas)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="1"
                                keyboardType="numeric"
                                value={duracionHoras}
                                onChangeText={setDuracionHoras}
                            />
                        </View>
                        <View style={[styles.inputGroup, styles.halfInput]}>
                            <Text style={styles.label}>Duración (minutos)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="30"
                                keyboardType="numeric"
                                value={duracionMinutos}
                                onChangeText={setDuracionMinutos}
                            />
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.createButton, cargando && styles.buttonDisabled]}
                        onPress={handleCrearTaller}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.createButtonText}>Crear Taller</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <EspacioSelectorModal />

            {showDatePicker && (
                <DateTimePicker
                    value={fecha}
                    mode="date"
                    display="default"
                    onChange={(e, d) => { setShowDatePicker(false); if (d) setFecha(d); }}
                    minimumDate={new Date()}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={horaInicio}
                    mode="time"
                    display="default"
                    onChange={(e, t) => { setShowTimePicker(false); if (t) setHoraInicio(t); }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backText: {
        fontSize: 16,
        color: '#64748B',
        marginLeft: 4,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: '#1E293B',
    },
    textArea: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: '#1E293B',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 14,
    },
    dateText: {
        fontSize: 14,
        color: '#1E293B',
        flex: 1,
    },
    selectorInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 14,
    },
    selectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    selectorText: {
        fontSize: 14,
        color: '#1E293B',
        flex: 1,
    },
    selectorPlaceholder: {
        color: '#94A3B8',
    },
    espacioInfo: {
        marginTop: 8,
        marginLeft: 4,
    },
    espacioInfoText: {
        fontSize: 12,
        color: '#64748B',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    halfInput: {
        flex: 1,
    },
    createButton: {
        backgroundColor: '#00d97e',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '85%',
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
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        margin: 16,
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#1E293B',
    },
    categoriesScroll: {
        marginBottom: 8,
        maxHeight: 45,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryChipActive: {
        backgroundColor: '#00d97e',
        borderColor: '#00d97e',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        minHeight: 80,
    },
    modalItemActive: {
        backgroundColor: '#F0FDF4',
    },
    modalItemContent: {
        flex: 1,
        paddingRight: 12,
    },
    modalItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
        flexWrap: 'wrap',
    },
    modalItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
        flexShrink: 1,
    },
    modalItemTextActive: {
        color: '#00d97e',
    },
    modalItemBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginLeft: 8,
    },
    modalItemBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#2E7D32',
    },
    modalItemSubtext: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 18,
    },
    modalEmptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    modalEmptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginTop: 12,
    },
    loaderContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 10,
        color: '#64748B',
    },
});

export default CrearTallerScreen;