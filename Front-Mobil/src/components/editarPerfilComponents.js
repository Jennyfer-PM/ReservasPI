import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

const EditarPerfilComponents = ({ visible, onClose, userData, onUpdate, tipoUsuario = 'alumno' }) => {
  const [telefono, setTelefono] = useState(userData?.telefono || "");
  const [carrera, setCarrera] = useState(userData?.carrera || "");
  const [area, setArea] = useState(userData?.area || "");
  const [departamento, setDepartamento] = useState(userData?.departamento || "");
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const [showAreasModal, setShowAreasModal] = useState(false);
  const [areasList, setAreasList] = useState([]);
  
  const esDocente = tipoUsuario === 'docente';

  useEffect(() => {
    if (esDocente && visible) {
      cargarAreas();
    }
  }, [visible]);

  const cargarAreas = async () => {
    try {
      setCargandoAreas(true);
      const response = await fetch(`${API_BASE_URL}/areas`);
      if (response.ok) {
        const data = await response.json();
        setAreasList(data);
      }
    } catch (error) {
      console.error("Error cargando áreas:", error);
    } finally {
      setCargandoAreas(false);
    }
  };

  const manejarGuardado = () => {
    if (!telefono.trim()) {
      Alert.alert("Atención", "El teléfono es necesario para contactarte.");
      return;
    }

    const datosNuevos = {
      telefono: telefono,
    };
    
    if (!esDocente) {
      datosNuevos.carrera = carrera;
    } else {
      datosNuevos.area = area;
      datosNuevos.departamento = departamento;
    }

    onUpdate(datosNuevos);
  };

  const AreaSelectorModal = () => (
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
              <Text style={styles.loaderText}>Cargando áreas...</Text>
            </View>
          ) : (
            <FlatList
              data={areasList}
              keyExtractor={(item) => item.id?.toString() || item.nombre}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, area === item.nombre && styles.modalItemActive]}
                  onPress={() => {
                    setArea(item.nombre);
                    setDepartamento(item.departamento || '');
                    setShowAreasModal(false);
                  }}
                >
                  <View style={styles.modalItemContent}>
                    <Text style={[styles.modalItemText, area === item.nombre && styles.modalItemTextActive]}>
                      {item.nombre}
                    </Text>
                    {item.departamento && (
                      <Text style={styles.modalItemSubtext}>{item.departamento}</Text>
                    )}
                  </View>
                  {area === item.nombre && (
                    <Ionicons name="checkmark-circle" size={24} color="#00d97e" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.modalEmptyContainer}>
                  <Ionicons name="business-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.modalEmptyTitle}>No hay áreas disponibles</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.contenedorPrincipal}>
        <View style={styles.tarjetaModal}>
          
          <View style={styles.header}>
            <Text style={styles.titulo}>Editar perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cerrarIcono}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.campoGrupo}>
            <Text style={styles.etiqueta}>Nombre completo</Text>
            <TextInput 
              style={[styles.input, styles.inputBloqueado]} 
              value={userData?.nombre} 
              editable={false} 
            />
            <Text style={styles.textoAyuda}>Dato oficial no modificable</Text>
          </View>

          <View style={styles.campoGrupo}>
            <Text style={styles.etiqueta}>Email institucional</Text>
            <TextInput 
              style={[styles.input, styles.inputBloqueado]} 
              value={userData?.email} 
              editable={false} 
            />
          </View>

          <View style={styles.campoGrupo}>
            <Text style={styles.etiqueta}>Teléfono de contacto</Text>
            <TextInput 
              style={styles.input} 
              value={telefono} 
              onChangeText={setTelefono} 
              keyboardType="phone-pad"
              placeholder="Ej. 442..."
            />
          </View>

          {!esDocente ? (
            <>
              <View style={styles.campoGrupo}>
                <Text style={styles.etiqueta}>Carrera / Programa</Text>
                <TextInput 
                  style={styles.input} 
                  value={carrera} 
                  onChangeText={setCarrera} 
                  placeholder="Ej. Ingeniería en Software"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.campoGrupo}>
                <Text style={styles.etiqueta}>Área de adscripción</Text>
                <TouchableOpacity 
                  style={styles.selectorInput}
                  onPress={() => setShowAreasModal(true)}
                >
                  <Text style={[styles.selectorText, !area && styles.selectorPlaceholder]}>
                    {area || "Selecciona tu área"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                {area && (
                  <Text style={styles.textoAyuda}>
                    {departamento ? `Departamento: ${departamento}` : 'Área seleccionada'}
                  </Text>
                )}
              </View>

              <View style={styles.campoGrupo}>
                <Text style={styles.etiqueta}>Departamento</Text>
                <TextInput 
                  style={[styles.input, styles.inputBloqueado]} 
                  value={departamento} 
                  editable={false}
                  placeholder="Se selecciona con el área"
                />
                <Text style={styles.textoAyuda}>El departamento se asigna automáticamente según el área</Text>
              </View>
            </>
          )}

          <View style={styles.filaBotones}>
            <TouchableOpacity style={styles.botonCancelar} onPress={onClose}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.botonGuardar} onPress={manejarGuardado}>
              <Text style={styles.textoGuardar}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <AreaSelectorModal />
    </Modal>
  );
};

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24
  },
  tarjetaModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  cerrarIcono: {
    fontSize: 20,
    color: '#94a3b8'
  },
  campoGrupo: {
    marginBottom: 16
  },
  etiqueta: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: '#1e293b'
  },
  inputBloqueado: {
    backgroundColor: '#f8fafc',
    color: '#94a3b8',
    borderColor: '#f1f5f9'
  },
  selectorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ffffff'
  },
  selectorText: {
    fontSize: 15,
    color: '#1e293b'
  },
  selectorPlaceholder: {
    color: '#94a3b8'
  },
  textoAyuda: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic'
  },
  filaBotones: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10
  },
  botonCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center'
  },
  botonGuardar: {
    flex: 2,
    backgroundColor: '#00d97e',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  textoCancelar: {
    color: '#64748b',
    fontWeight: '600'
  },
  textoGuardar: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  modalItemActive: {
    backgroundColor: '#f0fdf4'
  },
  modalItemContent: {
    flex: 1
  },
  modalItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b'
  },
  modalItemTextActive: {
    color: '#00d97e'
  },
  modalItemSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2
  },
  modalEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  modalEmptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 12
  },
  loaderContainer: {
    padding: 40,
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 10,
    color: '#64748b'
  }
});

export default EditarPerfilComponents;