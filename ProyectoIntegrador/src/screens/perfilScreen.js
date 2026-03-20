import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/header';
import EditarPerfilComponents from '../components/editarPerfilComponents'; 
import HistorialReservasComponents from '../components/historialReservasComponents';
import perfilStyles from '../styles/perfilStyles';

const BREAKPOINT = 768;

const PerfilScreen = ({ navigation, route }) => {
    const { idUsuario } = route.params || { idUsuario: 1 };
    
    const [cargando, setCargando] = useState(true);
    const [datos, setDatos] = useState(null);
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [historialVisible, setHistorialVisible] = useState(false);

    const fetchPerfil = async () => {
        try {
            const response = await fetch(`http://192.168.100.95:8000/api/usuario/${idUsuario}`);
            if (!response.ok) throw new Error('Error al obtener datos');
            const json = await response.json();
            setDatos(json);
        } catch (error) {
            console.error("Error Perfil:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchPerfil();
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, [idUsuario]);

    const handleActualizarPerfil = async (nuevosDatos) => {
        try {
            setCargando(true);
            const response = await fetch('http://192.168.100.95:8000/api/usuario/actualizar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_persona: idUsuario,
                    nombre: nuevosDatos.nombre,
                    telefono: nuevosDatos.telefono,
                    carrera: nuevosDatos.carrera
                }),
            });

            if (response.ok) {
                Alert.alert("¡Éxito!", "Tu perfil ha sido actualizado correctamente.");
                setModalVisible(false);
                await fetchPerfil(); 
            } else {
                const errorJson = await response.json();
                Alert.alert("Error", errorJson.detail || "No se pudo actualizar.");
            }
        } catch (error) {
            Alert.alert("Error", "Problema de conexión con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    const isWebLayout = windowWidth > BREAKPOINT;

    const handleLogout = () => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return parts[0].substring(0, 2).toUpperCase();
    };

    if (cargando && !datos) {
        return (
            <View style={[perfilStyles.mainContainer, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <View style={perfilStyles.mainContainer}>
            <Header 
                userName={datos?.nombre || "Usuario"} 
                role="Alumno" 
                isWeb={isWebLayout} 
                navigation={navigation} 
            />
            
            <ScrollView 
                contentContainerStyle={[perfilStyles.scrollInner, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={isWebLayout ? perfilStyles.centeredContentWeb : perfilStyles.mobilePadding}>
                    
                    <View style={perfilStyles.profileCard}>
                        <View style={perfilStyles.avatarLarge}>
                            <Text style={perfilStyles.avatarText}>{getInitials(datos?.nombre)}</Text>
                        </View>
                        
                        <Text style={perfilStyles.userNameLarge}>{datos?.nombre}</Text>
                        <Text style={perfilStyles.userPuesto}>{datos?.puesto || "Alumno UPQ"}</Text>
                        <Text style={perfilStyles.userFacultad}>{datos?.carrera || "Tecnologías de Información"}</Text>
                        
                        <TouchableOpacity 
                            style={perfilStyles.editLink} 
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={perfilStyles.editLinkText}>Editar perfil</Text>
                        </TouchableOpacity>

                        <View style={perfilStyles.detailsContainer}>
                            <InfoRow icon="mail-outline" label="Email institucional" value={datos?.email} />
                            <InfoRow icon="call-outline" label="Teléfono" value={datos?.telefono} />
                            <InfoRow icon="school-outline" label="Carrera" value={datos?.carrera} />
                            <InfoRow icon="calendar-outline" label="Miembro desde" value={datos?.miembroDesde} isLast={true} />
                        </View>
                    </View>

                    <View style={perfilStyles.kpiContainer}>
                        <KpiCard icon="calendar-blank-outline" count={datos?.totales || 0} label="Solicitudes totales" bgColor="#2563eb" />
                        <KpiCard icon="file-check-outline" count={datos?.aprobadas || 0} label="Solicitudes aprobadas" bgColor="#16a34a" />
                    </View>

                    <View style={perfilStyles.menuGroup}>
                        <MenuItem icon="person-outline" label="Información personal" />
                        
                        <MenuItem 
                            icon="clipboard-outline" 
                            label="Historial de reservas" 
                            onPress={() => setHistorialVisible(true)}
                        />

                        <MenuItem icon="settings-outline" label="Configuración" />
                        <MenuItem icon="log-out-outline" label="Cerrar sesión" color="#ef4444" onPress={handleLogout} isLast={true} />
                    </View>

                    <View style={perfilStyles.helpCard}>
                        <Text style={perfilStyles.helpTitle}>¿Necesitas ayuda?</Text>
                        <Text style={perfilStyles.helpSubtitle}>Contacta al equipo de administración de espacios.</Text>
                        <TouchableOpacity style={perfilStyles.helpButtonPrimary}><Text style={perfilStyles.helpButtonTextPrimary}>Contactar soporte</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* MODAL DE EDICIÓN */}
            {datos && (
                <EditarPerfilComponents 
                    visible={modalVisible} 
                    onClose={() => setModalVisible(false)} 
                    userData={datos} 
                    onUpdate={handleActualizarPerfil} 
                />
            )}

            {/* MODAL DE HISTORIAL */}
            <HistorialReservasComponents 
                visible={historialVisible} 
                onClose={() => setHistorialVisible(false)} 
                idUsuario={idUsuario} 
            />
        </View>
    );
};

const InfoRow = ({ icon, label, value, isLast }) => (
    <View style={[perfilStyles.infoRow, isLast && { borderBottomWidth: 0 }]}>
        <View style={perfilStyles.infoIconContainer}><Ionicons name={icon} size={20} color="#64748b" /></View>
        <View>
            <Text style={perfilStyles.infoLabel}>{label}</Text>
            <Text style={perfilStyles.infoValue}>{value || "No disponible"}</Text>
        </View>
    </View>
);

const KpiCard = ({ icon, count, label, bgColor }) => (
    <View style={[perfilStyles.kpiCard, { backgroundColor: bgColor }]}>
        <MaterialCommunityIcons name={icon} size={26} color="#fff" style={{ opacity: 0.8 }} />
        <Text style={perfilStyles.kpiCount}>{count}</Text>
        <Text style={perfilStyles.kpiLabel}>{label}</Text>
    </View>
);

const MenuItem = ({ icon, label, color = "#1e293b", onPress, isLast }) => (
    <TouchableOpacity style={[perfilStyles.menuItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
        <View style={perfilStyles.menuItemLeft}>
            <Ionicons name={icon} size={22} color={color} />
            <Text style={[perfilStyles.menuItemText, { color }]}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </TouchableOpacity>
);

export default PerfilScreen;