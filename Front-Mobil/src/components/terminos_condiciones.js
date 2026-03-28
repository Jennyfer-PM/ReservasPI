import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TerminosCondiciones = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Términos y Condiciones</Text>
              <Text style={styles.headerSubtitle}>Sistema de Gestión de Talleres</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.updateDate}>Última actualización: 12 de marzo de 2026</Text>
            
            <Text style={styles.sectionTitle}>1. Uso del Sistema</Text>
            <Text style={styles.bodyText}>
              El acceso está restringido exclusivamente a estudiantes, docentes y personal administrativo 
              con credenciales institucionales válidas (@upq.edu.mx). El uso del sistema implica la 
              aceptación de estos términos.
            </Text>

            <Text style={styles.sectionTitle}>2. Inscripción a Talleres</Text>
            <Text style={styles.bodyText}>
              Los estudiantes pueden inscribirse en talleres disponibles siempre que cumplan con los 
              requisitos establecidos (carrera, nivel, capacidad). Cada reserva debe ser confirmada 
              por el área correspondiente.
            </Text>

            <Text style={styles.sectionTitle}>3. Privacidad y Protección de Datos</Text>
            <Text style={styles.bodyText}>
              El sistema recopila nombre, correo institucional, matrícula y carrera. Estos datos se 
              utilizan exclusivamente para fines académicos y de gestión de espacios. No se comparten 
              con terceros sin consentimiento.
            </Text>

            <Text style={styles.sectionTitle}>4. Responsabilidades de los Usuarios</Text>
            <Text style={styles.bodyText}>
              Los usuarios son responsables de proporcionar información precisa al realizar reservas. 
              Cualquier uso indebido del sistema puede resultar en la suspensión de la cuenta.
            </Text>

            <Text style={styles.sectionTitle}>5. Cancelaciones y Modificaciones</Text>
            <Text style={styles.bodyText}>
              Las reservas pueden ser canceladas con al menos 24 horas de anticipación. Las cancelaciones 
              tardías o inasistencias pueden afectar la disponibilidad futura.
            </Text>

            <Text style={styles.sectionTitle}>6. Conducta en los Espacios</Text>
            <Text style={styles.bodyText}>
              Los usuarios deben mantener un comportamiento adecuado en los espacios reservados. 
              Cualquier daño al equipo o instalaciones será responsabilidad del solicitante.
            </Text>

            <View style={styles.contactBox}>
              <Ionicons name="mail-outline" size={20} color="#00d97e" />
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Contacto y Soporte</Text>
                <Text style={styles.contactText}>soporte.talleres@upq.edu.mx</Text>
                <Text style={styles.contactText}>Horario: Lunes a Viernes, 9:00 AM - 6:00 PM</Text>
                <Text style={styles.contactText}>Teléfono: (442) 123 4567</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.acceptButton} onPress={onClose}>
              <Text style={styles.acceptButtonText}>Aceptar términos</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 500,
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  header: {
    backgroundColor: '#00d97e',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.9,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
  },
  updateDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 20,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 8,
  },
  contactBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCfCE7',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 2,
  },
  acceptButton: {
    backgroundColor: '#00d97e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TerminosCondiciones;