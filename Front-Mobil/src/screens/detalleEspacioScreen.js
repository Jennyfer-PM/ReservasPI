import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, Platform, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const DetalleEspacioScreen = ({ route, navigation }) => {
  const { id, titulo, edificio, capacidad, ubicacion, tipo, usuario, idUsuario } = route.params || {};
  const [asistentes, setAsistentes] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [propósito, setPropósito] = useState('');

  const handleConfirmar = async () => {
    if (!propósito.trim()) {
      Alert.alert("Error", "Por favor ingresa el propósito de la reserva");
      return;
    }
    if (!asistentes || parseInt(asistentes) <= 0) {
      Alert.alert("Error", "Ingresa un número válido de asistentes");
      return;
    }
    if (parseInt(asistentes) > capacidad) {
      Alert.alert("Error", `La capacidad máxima es de ${capacidad} personas`);
      return;
    }

    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      Alert.alert("Éxito", "Reserva enviada correctamente");
      navigation.navigate('Mis Talleres', { usuario, idUsuario });
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Header userName={usuario || "Usuario"} role="Alumno" isWeb={false} navigation={navigation} idUsuario={idUsuario} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#64748B" />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>

          <View style={styles.spaceHeader}>
            <Text style={styles.spaceType}>{tipo || 'Espacio'}</Text>
            <Text style={styles.spaceTitle}>{titulo}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#64748B" />
              <Text style={styles.locationText}>{edificio} - {ubicacion}</Text>
            </View>
            <View style={styles.capacityRow}>
              <Ionicons name="people-outline" size={16} color="#64748B" />
              <Text style={styles.capacityText}>Capacidad máxima: {capacidad} personas</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Solicitar reserva</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Propósito *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Clase de Programación, Taller de Diseño..."
                placeholderTextColor="#94A3B8"
                value={propósito}
                onChangeText={setPropósito}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de asistentes *</Text>
              <TextInput
                style={styles.input}
                placeholder={`Máximo ${capacidad} personas`}
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={asistentes}
                onChangeText={setAsistentes}
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color="#00d97e" />
              <Text style={styles.infoText}>
                Tu solicitud será revisada y recibirás una notificación cuando sea confirmada.
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.confirmButton, enviando && styles.buttonDisabled]}
              onPress={handleConfirmar}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>Confirmar reserva</Text>
                  <Ionicons name="checkmark-outline" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
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
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isDesktop ? 32 : 20,
    paddingTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 4,
  },
  spaceHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
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
  spaceType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00d97e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  spaceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capacityText: {
    fontSize: 14,
    color: '#64748B',
  },
  formCard: {
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
    marginBottom: 20,
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
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#1E293B',
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
    lineHeight: 16,
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

export default DetalleEspacioScreen;