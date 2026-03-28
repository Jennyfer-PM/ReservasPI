import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Dimensions,
  StyleSheet, ActivityIndicator, Platform, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const MisTalleresScreen = ({ navigation, route }) => {
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [windowWidth, setWindowWidth] = useState(width);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { usuario, idUsuario } = route.params || { usuario: 'Usuario', idUsuario: null };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  const obtenerSolicitudes = async () => {
    try {
      setCargando(true);
      const response = await fetch(`${API_BASE_URL}/reservas?usuario_id=${idUsuario}`);
      const data = await response.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      setSolicitudes([]);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    obtenerSolicitudes();
  };

  const conteos = {
    Todas: solicitudes.length,
    Pendientes: solicitudes.filter(s => s.estado === 'Pendiente').length,
    Autorizadas: solicitudes.filter(s => s.estado === 'Autorizada').length,
    Rechazadas: solicitudes.filter(s => s.estado === 'Rechazada').length,
  };

  const isWebLayout = windowWidth > 768;

  const solicitudesFiltradas = () => {
    if (filtroEstado === 'Todas') return solicitudes;
    const mapaEstados = {
      'Pendientes': 'Pendiente',
      'Autorizadas': 'Autorizada',
      'Rechazadas': 'Rechazada'
    };
    return solicitudes.filter(item => item.estado === mapaEstados[filtroEstado]);
  };

  const getStatusStyle = (estado) => {
    switch (estado) {
      case 'Autorizada':
        return { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle', borderColor: '#C8E6C9' };
      case 'Rechazada':
        return { bg: '#FFEBEE', text: '#C62828', icon: 'close-circle', borderColor: '#FFCDD2' };
      case 'Pendiente':
        return { bg: '#FFF3E0', text: '#EF6C00', icon: 'time-outline', borderColor: '#FFE0B2' };
      default:
        return { bg: '#F5F5F5', text: '#616161', icon: 'help-circle', borderColor: '#E0E0E0' };
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no disponible';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statsCards = [
    { label: 'Todas', count: conteos.Todas, icon: 'list-outline', color: '#3B82F6' },
    { label: 'Pendientes', count: conteos.Pendientes, icon: 'time-outline', color: '#F59E0B' },
    { label: 'Autorizadas', count: conteos.Autorizadas, icon: 'checkmark-circle-outline', color: '#10B981' },
    { label: 'Rechazadas', count: conteos.Rechazadas, icon: 'close-circle-outline', color: '#EF4444' }
  ];

  return (
    <View style={styles.container}>
      <Header userName={usuario} role="Alumno" isWeb={isWebLayout} navigation={navigation} idUsuario={idUsuario} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00d97e']} />
        }
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Mis Solicitudes</Text>
          <Text style={styles.subtitle}>Gestiona y revisa el estado de tus reservas</Text>

          {/* Tarjetas de estadísticas */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            {statsCards.map((stat) => (
              <TouchableOpacity
                key={stat.label}
                style={[
                  styles.statCard,
                  filtroEstado === stat.label && styles.statCardActive
                ]}
                onPress={() => setFiltroEstado(stat.label)}
                activeOpacity={0.8}
              >
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={styles.statCount}>{stat.count}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Chips de filtro adicionales */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['Todas', 'Pendientes', 'Autorizadas', 'Rechazadas'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  filtroEstado === filter && styles.filterChipActive
                ]}
                onPress={() => setFiltroEstado(filter)}
              >
                <Text style={[
                  styles.filterChipText,
                  filtroEstado === filter && styles.filterChipTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Lista de solicitudes */}
          {cargando ? (
            <ActivityIndicator size="large" color="#00d97e" style={styles.loader} />
          ) : (
            <View style={styles.listContainer}>
              {solicitudesFiltradas().length > 0 ? (
                solicitudesFiltradas().map((item) => {
                  const statusStyle = getStatusStyle(item.estado);
                  return (
                    <View key={item.id} style={[styles.solicitudCard, { borderLeftColor: statusStyle.text }]}>
                      <View style={styles.cardHeader}>
                        <View style={styles.cardTitleContainer}>
                          <Text style={styles.cardTitle}>{item.espacio_nombre}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                            <Ionicons name={statusStyle.icon} size={12} color={statusStyle.text} />
                            <Text style={[styles.statusText, { color: statusStyle.text }]}>
                              {item.estado}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Text style={styles.cardSubtitle} numberOfLines={2}>
                        {item.proposito || 'Sin propósito especificado'}
                      </Text>

                      <View style={styles.cardDetails}>
                        <View style={styles.detailRow}>
                          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
                          <Text style={styles.detailText}>{formatFecha(item.fecha)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Ionicons name="location-outline" size={14} color="#94A3B8" />
                          <Text style={styles.detailText}>UPQ - {item.espacio_nombre}</Text>
                        </View>
                        {item.duracion && (
                          <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={14} color="#94A3B8" />
                            <Text style={styles.detailText}>Duración: {item.duracion}</Text>
                          </View>
                        )}
                      </View>

                      {item.estado === 'Pendiente' && (
                        <View style={styles.pendingNote}>
                          <Ionicons name="information-circle-outline" size={14} color="#F59E0B" />
                          <Text style={styles.pendingNoteText}>
                            Tu solicitud está en revisión. Te notificaremos cuando sea confirmada.
                          </Text>
                        </View>
                      )}

                      {item.estado === 'Autorizada' && (
                        <TouchableOpacity style={styles.viewDetailsButton}>
                          <Text style={styles.viewDetailsText}>Ver detalles de la reserva</Text>
                          <Ionicons name="chevron-forward" size={16} color="#00d97e" />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
                  <Text style={styles.emptyTitle}>No hay solicitudes</Text>
                  <Text style={styles.emptyText}>
                    {filtroEstado === 'Todas' 
                      ? 'Aún no has realizado ninguna reserva'
                      : `No tienes solicitudes ${filtroEstado.toLowerCase()}`}
                  </Text>
                  <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => navigation.navigate('Explorar', { usuario, idUsuario })}
                  >
                    <Text style={styles.exploreButtonText}>Explorar espacios</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
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
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isDesktop ? 32 : 20,
    paddingTop: 24,
  },
  title: {
    fontSize: isDesktop ? 28 : 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: isDesktop ? 16 : 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
  },
  statsScroll: {
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  statCardActive: {
    borderColor: '#00d97e',
    borderWidth: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#00d97e',
    borderColor: '#00d97e',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 40,
  },
  listContainer: {
    marginTop: 8,
  },
  solicitudCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderLeftWidth: 4,
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
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardDetails: {
    gap: 8,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#64748B',
  },
  pendingNote: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginTop: 8,
  },
  pendingNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#B45309',
    lineHeight: 16,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#00d97e',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00d97e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 24,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MisTalleresScreen;