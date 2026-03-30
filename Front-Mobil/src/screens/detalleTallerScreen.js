import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    RefreshControl,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const DetalleTallerScreen = ({ navigation, route }) => {
    const { taller, usuario, idUsuario } = route.params || {};
    
    // ========== ESTADOS ==========
    const [cargando, setCargando] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [alumnosInscritos, setAlumnosInscritos] = useState([]);
    const [tallerInfo, setTallerInfo] = useState(taller || null);

    // ========== EFECTOS ==========
    useEffect(() => {
        if (tallerInfo) {
            cargarAlumnosInscritos();
        }
    }, []);

    // ========== FUNCIONES ==========
    const cargarAlumnosInscritos = async () => {
        try {
            setCargando(true);
            const response = await fetch(`${API_BASE_URL}/docente/taller/${tallerInfo.id}/inscritos`);
            if (response.ok) {
                const data = await response.json();
                setAlumnosInscritos(data);
            }
        } catch (error) {
            console.error("Error cargando inscritos:", error);
        } finally {
            setCargando(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        cargarAlumnosInscritos();
        setRefreshing(false);
    };

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

    const formatFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        return new Date(fecha).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatHorario = (inicio, fin) => {
        return `${inicio} - ${fin}`;
    };

    const handleEliminarTaller = () => {
        Alert.alert(
            "Eliminar taller",
            "¿Estás seguro de que deseas eliminar este taller? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        setCargando(true);
                        try {
                            const response = await fetch(`${API_BASE_URL}/docente/taller/${tallerInfo.id}`, {
                                method: 'DELETE'
                            });
                            if (response.ok) {
                                Alert.alert("Éxito", "Taller eliminado correctamente");
                                navigation.goBack();
                            } else {
                                Alert.alert("Error", "No se pudo eliminar el taller");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Error de conexión");
                        } finally {
                            setCargando(false);
                        }
                    }
                }
            ]
        );
    };

    const handleExportarLista = () => {
        Alert.alert("Exportar lista", "La lista de alumnos se exportará en formato CSV");
    };

    // ========== VALIDACIÓN ==========
    if (!tallerInfo) {
        return (
            <SafeAreaView style={styles.container}>
                <Header 
                    userName={usuario} 
                    role="Docente" 
                    isWeb={false} 
                    navigation={navigation} 
                    idUsuario={idUsuario} 
                />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                    <Text style={styles.errorTitle}>Error</Text>
                    <Text style={styles.errorText}>No se pudo cargar la información del taller</Text>
                    <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.errorButtonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ========== RENDER PRINCIPAL ==========
    return (
        <SafeAreaView style={styles.container}>
            <Header 
                userName={usuario} 
                role="Docente" 
                isWeb={false} 
                navigation={navigation} 
                idUsuario={idUsuario} 
            />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00d97e']} />
                }
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#64748B" />
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>

                {/* Información del taller */}
                <View style={styles.tallerHeader}>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{tallerInfo.estado || 'Activo'}</Text>
                    </View>
                    <Text style={styles.tallerTitle}>{tallerInfo.titulo}</Text>
                    <Text style={styles.tallerLugar}>{tallerInfo.lugar}</Text>
                    
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar-outline" size={20} color="#00d97e" />
                            <Text style={styles.infoLabel}>Fecha</Text>
                            <Text style={styles.infoValue}>{formatFecha(tallerInfo.fecha)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={20} color="#00d97e" />
                            <Text style={styles.infoLabel}>Horario</Text>
                            <Text style={styles.infoValue}>{formatHorario(tallerInfo.horaInicio, tallerInfo.horaFin)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="people-outline" size={20} color="#00d97e" />
                            <Text style={styles.infoLabel}>Capacidad</Text>
                            <Text style={styles.infoValue}>{tallerInfo.inscritos}/{tallerInfo.capacidad}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar-number-outline" size={20} color="#00d97e" />
                            <Text style={styles.infoLabel}>Inicia en</Text>
                            <Text style={styles.infoValue}>{getDiasRestantes(tallerInfo.fecha)}</Text>
                        </View>
                    </View>

                    {tallerInfo.descripcion && (
                        <View style={styles.descripcionContainer}>
                            <Text style={styles.descripcionTitle}>Descripción</Text>
                            <Text style={styles.descripcionText}>{tallerInfo.descripcion}</Text>
                        </View>
                    )}
                </View>

                {/* Lista de alumnos inscritos */}
                <View style={styles.alumnosSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Alumnos inscritos ({alumnosInscritos.length})
                        </Text>
                        <TouchableOpacity onPress={handleExportarLista} style={styles.exportButton}>
                            <Ionicons name="download-outline" size={18} color="#00d97e" />
                            <Text style={styles.exportText}>Exportar</Text>
                        </TouchableOpacity>
                    </View>

                    {cargando ? (
                        <ActivityIndicator size="large" color="#00d97e" style={styles.loader} />
                    ) : alumnosInscritos.length > 0 ? (
                        alumnosInscritos.map((alumno) => (
                            <View key={alumno.id} style={styles.alumnoCard}>
                                <View style={styles.alumnoAvatar}>
                                    <Text style={styles.alumnoAvatarText}>
                                        {alumno.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.alumnoInfo}>
                                    <Text style={styles.alumnoNombre}>{alumno.nombre}</Text>
                                    <Text style={styles.alumnoMatricula}>{alumno.matricula}</Text>
                                    <Text style={styles.alumnoEmail}>{alumno.email}</Text>
                                </View>
                                <TouchableOpacity style={styles.alumnoAction}>
                                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={48} color="#CBD5E1" />
                            <Text style={styles.emptyTitle}>No hay alumnos inscritos</Text>
                            <Text style={styles.emptyText}>Aún no hay alumnos registrados en este taller</Text>
                        </View>
                    )}
                </View>

                {/* Botones de acción */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => navigation.navigate('EditarTaller', { 
                            taller: tallerInfo, 
                            usuario, 
                            idUsuario 
                        })}
                    >
                        <Ionicons name="create-outline" size={20} color="#3B82F6" />
                        <Text style={styles.editButtonText}>Editar taller</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleEliminarTaller}
                    >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        <Text style={styles.deleteButtonText}>Eliminar taller</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ============================================
// ESTILOS
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA'
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8
    },
    backText: {
        fontSize: 16,
        color: '#64748B',
        marginLeft: 4
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 16
    },
    errorText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
        textAlign: 'center'
    },
    errorButton: {
        backgroundColor: '#00d97e',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 20
    },
    errorButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14
    },
    tallerHeader: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2E7D32'
    },
    tallerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8
    },
    tallerLugar: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 20
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    infoItem: {
        flex: 1,
        minWidth: 100,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 12
    },
    infoLabel: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 6,
        marginBottom: 2
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B'
    },
    descripcionContainer: {
        marginTop: 8
    },
    descripcionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8
    },
    descripcionText: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20
    },
    alumnosSection: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B'
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    exportText: {
        fontSize: 13,
        color: '#00d97e',
        fontWeight: '500'
    },
    loader: {
        marginTop: 40
    },
    alumnoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9'
    },
    alumnoAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    alumnoAvatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32'
    },
    alumnoInfo: {
        flex: 1
    },
    alumnoNombre: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 2
    },
    alumnoMatricula: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 2
    },
    alumnoEmail: {
        fontSize: 11,
        color: '#94A3B8'
    },
    alumnoAction: {
        padding: 8
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginTop: 12
    },
    emptyText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center'
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginBottom: 30
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1
    },
    editButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#3B82F6'
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6'
    },
    deleteButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#EF4444'
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444'
    }
});

export default DetalleTallerScreen;