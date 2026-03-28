import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  Image, SafeAreaView, ActivityIndicator, Dimensions, 
  StyleSheet, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

// MAPA DE IMÁGENES
const IMAGENES_ESPACIOS = {
  'Laboratorios': require('../../assets/laboratorio.jpg'),
  'Salas de Cómputo': require('../../assets/salacomputo.jpg'),
  'Auditorios': require('../../assets/auditorio.jpg'),
  'Biblioteca': require('../../assets/biblioteca.jpg'),
  'Salas': require('../../assets/sala.jpg'),
  'Talleres': require('../../assets/taller.jpg'),
  'Salones': require('../../assets/salon.jpg'),
  'Default': require('../../assets/laboratorio.jpg'),
};

// Función para obtener el tipo de espacio (usa 'area' primero)
const obtenerTipoEspacio = (espacio) => {
  if (!espacio) return 'Default';
  if (espacio.area) return espacio.area;
  if (espacio.tipo) return espacio.tipo;
  return 'Default';
};

// Función para obtener la imagen según el tipo
const getImagenEspacio = (tipo) => {
  if (!tipo) return IMAGENES_ESPACIOS['Default'];
  if (IMAGENES_ESPACIOS[tipo]) return IMAGENES_ESPACIOS[tipo];
  
  for (const key in IMAGENES_ESPACIOS) {
    if (tipo.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(tipo.toLowerCase())) {
      return IMAGENES_ESPACIOS[key];
    }
  }
  return IMAGENES_ESPACIOS['Default'];
};

const FormularioReserva = ({ route, navigation }) => {
  const { espacio, usuario, idUsuario } = route.params || {};
  
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [proposito, setProposito] = useState('');
  const [asistentes, setAsistentes] = useState('');
  const [cargando, setCargando] = useState(false);
  const [status, setStatus] = useState('idle');

  const tipoEspacio = obtenerTipoEspacio(espacio);
  const imagenEspacio = getImagenEspacio(tipoEspacio);

  const handleFechaChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setFecha(selectedDate);
  };

  const handleHoraChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setHora(selectedTime);
  };

const handleConfirmar = async () => {
  if (!proposito.trim()) {
    Alert.alert('Error', 'Por favor ingresa el propósito de la reserva');
    return;
  }
  if (!asistentes || parseInt(asistentes) <= 0) {
    Alert.alert('Error', 'Por favor ingresa un número válido de asistentes');
    return;
  }
  if (parseInt(asistentes) > espacio.capacidad) {
    Alert.alert('Error', `La capacidad máxima es de ${espacio.capacidad} personas`);
    return;
  }

  const fechaHora = new Date(fecha);
  fechaHora.setHours(hora.getHours(), hora.getMinutes(), 0, 0);

  setCargando(true);
  
  try {
    // 1. Crear la reserva
    const reservaData = {
      id_docente: 1,
      nombre: proposito,
      id_espacio: espacio.id,
      fecha: fechaHora.toISOString(),
      duracion: '1 hour 30 minutes',
      id_servicio: 1,
      detalles: `Reserva para ${asistentes} personas`,
      asistentes: parseInt(asistentes)
    };

    console.log("Creando reserva:", reservaData);
    const reservaResponse = await fetch(`${API_BASE_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservaData)
    });

    if (!reservaResponse.ok) {
      const error = await reservaResponse.json();
      throw new Error(error.detail || 'Error al crear la reserva');
    }

    const reservaResult = await reservaResponse.json();
    console.log("Reserva creada:", reservaResult);
    
    // 2. Obtener el ID del alumno a partir del ID de usuario
    const alumnoResponse = await fetch(`${API_BASE_URL}/usuario/alumno/${idUsuario}`);
    if (!alumnoResponse.ok) {
      throw new Error('No se encontró el registro de alumno');
    }
    const alumnoData = await alumnoResponse.json();
    const idAlumno = alumnoData.id;
    
    // 3. Crear la solicitud - Enviar parámetros en la URL
    console.log("Creando solicitud - id_alumno:", idAlumno, "id_reserva:", reservaResult.id_reserva);
    const solicitudResponse = await fetch(`${API_BASE_URL}/solicitudes?id_alumno=${idAlumno}&id_reserva=${reservaResult.id_reserva}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!solicitudResponse.ok) {
      const error = await solicitudResponse.json();
      throw new Error(error.detail || 'Error al crear la solicitud');
    }

    setStatus('success');
    setTimeout(() => {
      navigation.navigate('Mis Talleres', { usuario, idUsuario });
    }, 2000);
    
  } catch (error) {
    console.error("Error:", error);
    Alert.alert('Error', error.message || 'No se pudo completar la reserva');
  } finally {
    setCargando(false);
  }
};

 if (status === 'success') {
  return (
    <SafeAreaView style={styles.successContainer}>
      <View style={styles.successContent}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#00d97e" />
        </View>
        <Text style={styles.successTitle}>¡Reserva Enviada!</Text>
        <Text style={styles.successMessage}>
          Tu solicitud ha sido registrada exitosamente. Recibirás una notificación cuando sea confirmada.
        </Text>
        <TouchableOpacity 
          style={styles.successButton}
          onPress={() => {
            navigation.navigate('Main', {
              screen: 'Mis Talleres',
              params: { usuario, idUsuario }
            });
          }}
        >
          <Text style={styles.successButtonText}>Ver mis reservas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

  if (!espacio) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>No se pudo cargar la información del espacio</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#64748B" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={[styles.contentContainer, isDesktop && styles.rowLayout]}>
          <View style={styles.spaceInfoSection}>
            <Image 
              source={imagenEspacio} 
              style={styles.spaceImage}
            />
            <View style={styles.spaceInfo}>
              <Text style={styles.spaceType}>{tipoEspacio}</Text>
              <Text style={styles.spaceName}>{espacio.nombre}</Text>
              <View style={styles.spaceDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color="#64748B" />
                  <Text style={styles.detailText}>{espacio.ubicacion || 'UPQ'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={16} color="#64748B" />
                  <Text style={styles.detailText}>Capacidad: {espacio.capacidad} personas</Text>
                </View>
              </View>
              <Text style={styles.descriptionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>
                Espacio equipado para actividades académicas y talleres. 
                Cuenta con mobiliario adecuado y equipo audiovisual disponible bajo solicitud.
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Solicitar reserva</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de uso *</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <Text style={styles.dateText}>
                  {fecha.toLocaleDateString('es-MX', { 
                    weekday: 'long', 
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
                style={styles.datePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <Text style={styles.dateText}>
                  {hora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Propósito de la reserva *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Ej. Clase de Programación, Taller de Liderazgo..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={proposito}
                onChangeText={setProposito}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de asistentes *</Text>
              <TextInput
                style={styles.input}
                placeholder={`Máximo ${espacio.capacidad} personas`}
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={asistentes}
                onChangeText={setAsistentes}
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#00d97e" />
              <Text style={styles.infoText}>
                Tu solicitud será revisada por el área correspondiente. Recibirás una notificación cuando sea confirmada.
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.confirmButton, cargando && styles.buttonDisabled]}
              onPress={handleConfirmar}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>Confirmar reserva</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={handleFechaChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={hora}
          mode="time"
          display="default"
          onChange={handleHoraChange}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#00d97e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
    padding: 32,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  successButton: {
    backgroundColor: '#00d97e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isDesktop ? 32 : 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 4,
  },
  contentContainer: {
    paddingHorizontal: isDesktop ? 32 : 20,
    paddingBottom: 40,
    gap: 24,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  spaceInfoSection: {
    flex: isDesktop ? 1.2 : 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
    height: isDesktop ? 300 : 200,
  },
  spaceInfo: {
    padding: 20,
  },
  spaceType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00d97e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  spaceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  spaceDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
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
  formTitle: {
    fontSize: 20,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FA',
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
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#1E293B',
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#1E293B',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: '#00d97e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormularioReserva;