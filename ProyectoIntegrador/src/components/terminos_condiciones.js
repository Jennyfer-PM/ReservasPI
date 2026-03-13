import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import termsStyles from '../styles/termsStyles';

const terminos_condiciones = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={termsStyles.modalOverlay}>
        <View style={termsStyles.container}>
          <View style={termsStyles.header}>
            <TouchableOpacity onPress={onClose} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="arrow-back" size={24} color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>Volver</Text>
            </TouchableOpacity>
            <View style={{ marginLeft: 15 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Términos y Condiciones</Text>
              <Text style={{ color: 'white', fontSize: 10 }}>Sistema de Gestión de Talleres</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={termsStyles.scrollContent}>
            <Text style={{ fontSize: 11, color: '#999', marginBottom: 10 }}>Última actualización: 12 de marzo de 2026</Text>
            
            <Text style={termsStyles.sectionTitle}>1. Uso del Sistema</Text>
            <Text style={termsStyles.bodyText}>El acceso está restringido exclusivamente a estudiantes, docentes y personal administrativo con credenciales institucionales válidas (.edu.mx o @estudiantes.universidad.edu.mx).</Text>

            <Text style={termsStyles.sectionTitle}>2. Inscripción a Talleres</Text>
            <Text style={termsStyles.bodyText}>Los estudiantes pueden inscribirse en talleres disponibles siempre que cumplan con los requisitos establecidos (carrera, nivel, capacidad).</Text>

            <Text style={termsStyles.sectionTitle}>3. Privacidad y Protección de Datos</Text>
            <Text style={termsStyles.bodyText}>El sistema recopila nombre, correo institucional y carrera. Estos datos se utilizan exclusivamente para fines académicos.</Text>

            <Text style={termsStyles.sectionTitle}>4. Responsabilidades de Docentes</Text>
            <Text style={termsStyles.bodyText}>Los docentes son responsables de proporcionar información precisa al crear talleres y gestionar las asistencias.</Text>

            <View style={termsStyles.contactBox}>
              <Text style={{ fontWeight: 'bold', color: '#2d3748' }}>Contacto y Soporte</Text>
              <Text style={{ fontSize: 13, color: '#4a5568' }}>soporte.talleres@universidad.edu.mx</Text>
              <Text style={{ fontSize: 13, color: '#4a5568' }}>Horario: Lunes a Viernes, 9:00 AM - 6:00 PM</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default terminos_condiciones;