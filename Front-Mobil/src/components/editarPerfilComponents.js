import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/api'; 

const editarPerfilComponents = ({ visible, onClose, userData, onUpdate }) => {
  const [telefono, setTelefono] = useState(userData?.telefono || "");
  const [carrera, setCarrera] = useState(userData?.carrera || "");

  const manejarGuardado = () => {
    if (!telefono.trim()) {
      Alert.alert("Atención", "El teléfono es necesario para contactarte.");
      return;
    }

    const datosNuevos = {
      telefono: telefono,
      carrera: carrera
    };

    onUpdate(datosNuevos);
  };

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

          {/* Campo: Nombre Completo (Bloqueado) */}
          <View style={styles.campoGrupo}>
            <Text style={styles.etiqueta}>Nombre completo</Text>
            <TextInput 
              style={[styles.input, styles.inputBloqueado]} 
              value={userData?.nombre} 
              editable={false} 
            />
            <Text style={styles.textoAyuda}>Dato oficial no modificable</Text>
          </View>

          {/* Campo: Email (Bloqueado) */}
          <View style={styles.campoGrupo}>
            <Text style={styles.etiqueta}>Email institucional</Text>
            <TextInput 
              style={[styles.input, styles.inputBloqueado]} 
              value={userData?.email} 
              editable={false} 
            />
          </View>

          {/* Campo: Teléfono (Editable) */}
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

          {/* Campo: Carrera (Editable) */}
          <View style={styles.campoGrupo}>
            <Text style={styles.etiqueta}>Carrera / Programa</Text>
            <TextInput 
              style={styles.input} 
              value={carrera} 
              onChangeText={setCarrera} 
            />
          </View>

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
    backgroundColor: '#2563eb',
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
  }
});

export default editarPerfilComponents;