import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, 
  TextInput, ActivityIndicator, Dimensions, StyleSheet, 
  Platform, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

// CATEGORÍAS - Coinciden exactamente con los nombres de las áreas en la BD (plural)
const CATEGORIAS = [
  'Todos',
  'Laboratorios',
  'Salas de Cómputo',
  'Auditorios',
  'Biblioteca',
  'Salas',
  'Talleres',
  'Salones'
];

// MAPA DE IMÁGENES
const IMAGENES_ESPACIOS = {
  'Laboratorios': require('../../assets/laboratorio.jpg'),
  'Salas de Cómputo': require('../../assets/salacomputo.jpg'),
  'Auditorios': require('../../assets/auditorio.jpg'),
  'Biblioteca': require('../../assets/biblioteca.jpg'),
  'Salas': require('../../assets/sala.jpg'),
  'Talleres': require('../../assets/taller.jpg'),
  'Salones': require('../../assets/salon.jpg'),
  'Default': require('../../assets/icon PI.png'),
};

const EspaciosScreen = ({ navigation, route }) => {
  const { usuario, idUsuario, tipoUsuario } = route.params || { usuario: 'Usuario', idUsuario: null, tipoUsuario: 'alumno' };
  
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [windowWidth, setWindowWidth] = useState(width);
  const [showFilters, setShowFilters] = useState(false);
  const [minCap, setMinCap] = useState('');
  const [maxCap, setMaxCap] = useState('');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    fetchEspacios();
  }, []);

    const fetchEspacios = async () => {
    try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/espacios`);
        const data = await response.json();
        
        console.log("=== DATOS RECIBIDOS ===");
        console.log("Total espacios:", data.length);
        
        if (data.length > 0) {
        // Mostrar TODOS los campos del primer espacio
        console.log("Primer espacio - TODOS los campos:");
        console.log(JSON.stringify(data[0], null, 2));
        
        // Verificar qué campos existen
        const campos = Object.keys(data[0]);
        console.log("Campos disponibles:", campos);
        
        // Verificar si tiene 'area'
        if (data[0].area) {
            console.log("✅ Tiene campo 'area':", data[0].area);
        } else {
            console.log("❌ NO tiene campo 'area'");
        }
        
        // Verificar si tiene 'tipo'
        if (data[0].tipo) {
            console.log("✅ Tiene campo 'tipo':", data[0].tipo);
        } else {
            console.log("❌ NO tiene campo 'tipo'");
        }
        }
        
        setEspacios(data);
    } catch (error) {
        console.error("Error al cargar espacios:", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
    };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEspacios();
  };

  const isWebLayout = windowWidth > 768;

  // Obtener el tipo correcto para la imagen y filtro
  const obtenerTipoEspacio = (esp) => {
    // Usar 'area' primero porque viene en plural y coincide con las categorías
    if (esp.area) return esp.area;
    if (esp.tipo) return esp.tipo;
    return 'General';
  };

  // Filtrar espacios
// Filtrar espacios - Versión simplificada y corregida
const espaciosFiltrados = espacios.filter(esp => {
  // Obtener el tipo directamente del campo 'area' que viene del backend
  const tipoEspacio = esp.area || 'General';
  
  // Coincidencia de categoría
  const coincideCategoria = filtro === 'Todos' || tipoEspacio === filtro;
  
  // Coincidencia de búsqueda
  const nombreEspacio = esp.nombre ? esp.nombre.toLowerCase() : "";
  const ubicacionEspacio = esp.ubicacion ? esp.ubicacion.toLowerCase() : "";
  const coincideBusqueda = nombreEspacio.includes(busqueda.toLowerCase()) || 
                          ubicacionEspacio.includes(busqueda.toLowerCase());
  
  // Coincidencia de capacidad
  const capacidad = esp.capacidad || 0;
  const min = minCap ? parseInt(minCap) : 0;
  const max = maxCap ? parseInt(maxCap) : 1000;
  const coincideCapacidad = capacidad >= min && capacidad <= max;
  
  // Log para depuración (solo cuando se selecciona una categoría específica)
  if (filtro !== 'Todos' && coincideCategoria) {
    console.log(`✅ Coincide: ${esp.nombre} - Tipo: ${tipoEspacio} - Filtro: ${filtro}`);
  }
  
  return coincideCategoria && coincideBusqueda && coincideCapacidad;
});

  const navegarAReserva = (espacio) => {
    navigation.navigate('FormularioReserva', { 
      espacio: espacio, 
      usuario, 
      idUsuario,
      tipoUsuario
    });
  };

  // Obtener imagen según el tipo
  const getImagenPorTipo = (tipo) => {
    if (!tipo) return IMAGENES_ESPACIOS['Default'];
    if (IMAGENES_ESPACIOS[tipo]) return IMAGENES_ESPACIOS[tipo];
    
    // Buscar coincidencia parcial
    for (const key in IMAGENES_ESPACIOS) {
      if (tipo.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(tipo.toLowerCase())) {
        return IMAGENES_ESPACIOS[key];
      }
    }
    return IMAGENES_ESPACIOS['Default'];
  };

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
          <Text style={styles.title}>Explorar Espacios</Text>
          <Text style={styles.subtitle}>
            Encuentra el lugar perfecto para tus actividades académicas
          </Text>

          {/* Barra de búsqueda */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o ubicación..."
              placeholderTextColor="#94A3B8"
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <TouchableOpacity 
              style={[styles.filterButton, showFilters && styles.filterButtonActive]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="options-outline" size={20} color="#1E293B" />
              <Text style={styles.filterButtonText}>Filtros</Text>
            </TouchableOpacity>
          </View>

          {/* Panel de filtros */}
          {showFilters && (
            <View style={styles.filtersPanel}>
              <Text style={styles.filtersTitle}>Filtrar por capacidad</Text>
              <View style={styles.capacityFilters}>
                <View style={styles.filterInputGroup}>
                  <Text style={styles.filterLabel}>Mínimo</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={minCap}
                    onChangeText={setMinCap}
                  />
                </View>
                <View style={styles.filterInputGroup}>
                  <Text style={styles.filterLabel}>Máximo</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="1000"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={maxCap}
                    onChangeText={setMaxCap}
                  />
                </View>
              </View>
              {(minCap || maxCap) && (
                <TouchableOpacity 
                  style={styles.clearFilters}
                  onPress={() => {
                    setMinCap('');
                    setMaxCap('');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Categorías */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIAS.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, filtro === cat && styles.categoryChipActive]}
                onPress={() => setFiltro(cat)}
              >
                <Text style={[styles.categoryText, filtro === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Contador de resultados */}
          <Text style={styles.resultCount}>
            {espaciosFiltrados.length} {espaciosFiltrados.length === 1 ? 'espacio encontrado' : 'espacios encontrados'}
          </Text>

          {/* Lista de espacios */}
          {loading ? (
            <ActivityIndicator size="large" color="#00d97e" style={styles.loader} />
          ) : (
            <View style={styles.gridContainer}>
              {espaciosFiltrados.map(esp => {
                const tipoEspacio = obtenerTipoEspacio(esp);
                const imagen = getImagenPorTipo(tipoEspacio);
                
                return (
                  <TouchableOpacity
                    key={esp.id}
                    style={styles.spaceCard}
                    activeOpacity={0.9}
                    onPress={() => navegarAReserva(esp)}
                  >
                    <Image 
                      source={imagen} 
                      style={styles.spaceImage}
                    />
                    <View style={styles.spaceInfo}>
                      <Text style={styles.spaceName}>{esp.nombre}</Text>
                      <View style={styles.spaceDetails}>
                        <View style={styles.detailBadge}>
                          <Ionicons name="location-outline" size={12} color="#64748B" />
                          <Text style={styles.detailBadgeText}>{esp.ubicacion || 'UPQ'}</Text>
                        </View>
                        <View style={styles.detailBadge}>
                          <Ionicons name="people-outline" size={12} color="#64748B" />
                          <Text style={styles.detailBadgeText}>{esp.capacidad} personas</Text>
                        </View>
                      </View>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{tipoEspacio}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.reserveButton}
                        onPress={() => navegarAReserva(esp)}
                      >
                        <Text style={styles.reserveButtonText}>Solicitar espacio</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Estado vacío */}
          {!loading && espaciosFiltrados.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No hay espacios disponibles</Text>
              <Text style={styles.emptyText}>
                {filtro !== 'Todos' ? `No hay espacios para la categoría "${filtro}"` : 'No hay espacios registrados'}
              </Text>
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
    maxWidth: 1200,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    marginLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  capacityFilters: {
    flexDirection: 'row',
    gap: 16,
  },
  filterInputGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  filterInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  clearFilters: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#00d97e',
    fontWeight: '500',
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#00d97e',
    borderColor: '#00d97e',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  resultCount: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 20,
  },
  spaceCard: {
    width: isDesktop ? '31%' : '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
  spaceImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F1F5F9',
  },
  spaceInfo: {
    padding: 16,
  },
  spaceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  spaceDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailBadgeText: {
    fontSize: 12,
    color: '#64748B',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
  reserveButton: {
    backgroundColor: '#00d97e',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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
});

export default EspaciosScreen;