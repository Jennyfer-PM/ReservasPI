import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Dimensions,
  StyleSheet, ActivityIndicator, Alert, Platform, RefreshControl
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/header';
import EditarPerfilComponents from '../components/editarPerfilComponents';
import HistorialReservasComponents from '../components/historialReservasComponents';
import HistorialDocenteComponents from '../components/historialDocenteComponents';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const PerfilScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const idUsuario = params.idUsuario;
  const usuario = params.usuario || 'Usuario';
  const tipoUsuario = params.tipoUsuario || 'alumno';
  
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [datos, setDatos] = useState(null);
  const [windowWidth, setWindowWidth] = useState(width);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [historialVisible, setHistorialVisible] = useState(false);

  const esDocente = tipoUsuario === 'docente';

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (idUsuario) {
      fetchPerfil();
    } else {
      setCargando(false);
      Alert.alert("Error", "No se pudo identificar al usuario");
    }
  }, [idUsuario]);

  const fetchPerfil = async () => {
    try {
      setCargando(true);
      let url;
      if (esDocente) {
        url = `${API_BASE_URL}/docente/detalles/${idUsuario}`;
      } else {
        url = `${API_BASE_URL}/usuario/${idUsuario}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener datos');
      const json = await response.json();
      setDatos(json);
    } catch (error) {
      console.error("Error Perfil:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPerfil();
  };

  const isWebLayout = windowWidth > 768;

  const handleActualizarPerfil = async (nuevosDatos) => {
    try {
      setCargando(true);
      
      let response;
      if (esDocente) {
        response = await fetch(`${API_BASE_URL}/docente/actualizar-adscripcion`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_persona: idUsuario,
            ...nuevosDatos
          }),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/usuario/actualizar`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_persona: idUsuario,
            telefono: nuevosDatos.telefono,
            carrera: nuevosDatos.carrera
          }),
        });
      }

      if (response.ok) {
        Alert.alert("¡Éxito!", "Tu perfil ha sido actualizado correctamente.");
        setModalEditarVisible(false);
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

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive", 
          onPress: () => {
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  if (cargando && !datos) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00d97e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        userName={datos?.nombre || usuario || "Usuario"} 
        role={esDocente ? "Docente" : "Alumno"} 
        isWeb={isWebLayout} 
        navigation={navigation} 
        idUsuario={idUsuario} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00d97e']} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>{getInitials(datos?.nombre)}</Text>
            </View>
            
            <Text style={styles.userNameLarge}>{datos?.nombre}</Text>
            <Text style={styles.userPuesto}>{esDocente ? "Docente UPQ" : "Alumno UPQ"}</Text>
            
            {!esDocente ? (
              <Text style={styles.userFacultad}>{datos?.carrera || "Tecnologías de Información"}</Text>
            ) : (
              <Text style={styles.userFacultad}>{datos?.areaAdscripcion || "Área académica"}</Text>
            )}
            
            <TouchableOpacity 
              style={styles.editLink}
              onPress={() => setModalEditarVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.editLinkText}>Editar perfil</Text>
              <Ionicons name="create-outline" size={16} color="#00d97e" />
            </TouchableOpacity>

            <View style={styles.detailsContainer}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email institucional</Text>
                  <Text style={styles.infoValue}>{datos?.email || "No disponible"}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="call-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Teléfono</Text>
                  <Text style={styles.infoValue}>{datos?.telefono || "No registrado"}</Text>
                </View>
              </View>
              
              {!esDocente ? (
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="school-outline" size={20} color="#64748B" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Carrera</Text>
                    <Text style={styles.infoValue}>{datos?.carrera || "No asignada"}</Text>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons name="business-outline" size={20} color="#64748B" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Departamento</Text>
                      <Text style={styles.infoValue}>{datos?.departamento || "No asignado"}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons name="folder-outline" size={20} color="#64748B" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Área de adscripción</Text>
                      <Text style={styles.infoValue}>{datos?.areaAdscripcion || "No asignada"}</Text>
                    </View>
                  </View>

                  {datos?.cargo && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <Ionicons name="briefcase-outline" size={20} color="#64748B" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Cargo</Text>
                        <Text style={styles.infoValue}>{datos.cargo}</Text>
                      </View>
                    </View>
                  )}

                  {datos?.especialidad && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <Ionicons name="rocket-outline" size={20} color="#64748B" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Especialidad</Text>
                        <Text style={styles.infoValue}>{datos.especialidad}</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
              
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Miembro desde</Text>
                  <Text style={styles.infoValue}>{datos?.miembroDesde || "2024"}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.kpiContainer}>
            <View style={[styles.kpiCard, { backgroundColor: '#3B82F6' }]}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={28} color="#FFFFFF" style={{ opacity: 0.9 }} />
              <Text style={styles.kpiCount}>{datos?.totales || 0}</Text>
              <Text style={styles.kpiLabel}>
                {esDocente ? 'Talleres totales' : 'Solicitudes totales'}
              </Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: '#10B981' }]}>
              <MaterialCommunityIcons name="check-circle-outline" size={28} color="#FFFFFF" style={{ opacity: 0.9 }} />
              <Text style={styles.kpiCount}>{datos?.aprobadas || 0}</Text>
              <Text style={styles.kpiLabel}>
                {esDocente ? 'Talleres aprobados' : 'Solicitudes aprobadas'}
              </Text>
            </View>
          </View>

          <View style={styles.menuGroup}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Mis Talleres', { usuario: datos?.nombre, idUsuario, tipoUsuario })}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="calendar-outline" size={22} color="#1E293B" />
                <Text style={styles.menuItemText}>
                  {esDocente ? 'Mis talleres' : 'Mis reservas'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setHistorialVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="time-outline" size={22} color="#1E293B" />
                <Text style={styles.menuItemText}>
                  {esDocente ? 'Historial de talleres' : 'Historial de reservas'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemLast, styles.logoutButton]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar sesión</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.helpCard}>
            <Ionicons name="help-circle-outline" size={32} color="#3B82F6" />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>¿Necesitas ayuda?</Text>
              <Text style={styles.helpSubtitle}>
                Contacta al equipo de administración para resolver tus dudas
              </Text>
              <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
                <Text style={styles.helpButtonText}>Contactar soporte</Text>
                <Ionicons name="mail-outline" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {datos && (
        <EditarPerfilComponents 
          visible={modalEditarVisible} 
          onClose={() => setModalEditarVisible(false)} 
          userData={{
            ...datos,
            id: idUsuario,
            id_persona: idUsuario,
            departamentoId: datos?.departamentoId,
            areaAdscripcionId: datos?.areaAdscripcionId
          }} 
          onUpdate={handleActualizarPerfil}
          tipoUsuario={tipoUsuario}
        />
      )}

      {!esDocente ? (
        <HistorialReservasComponents 
          visible={historialVisible} 
          onClose={() => setHistorialVisible(false)} 
          idUsuario={idUsuario} 
        />
      ) : (
        <HistorialDocenteComponents 
          visible={historialVisible} 
          onClose={() => setHistorialVisible(false)} 
          idUsuario={idUsuario} 
        />
      )}
    </View>
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
  contentWrapper: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isDesktop ? 32 : 20,
    paddingTop: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00d97e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  userNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userPuesto: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 2,
  },
  userFacultad: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 12,
  },
  editLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  editLinkText: {
    color: '#00d97e',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  kpiLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
    textAlign: 'center',
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  logoutButton: {
    minHeight: 60,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  logoutText: {
    color: '#EF4444',
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 20,
    gap: 15,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 20,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  helpSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  helpButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export default PerfilScreen;