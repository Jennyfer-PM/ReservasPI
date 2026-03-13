import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import editarPerfilStyles from '../styles/editarPerfilStyles';

// Componente para los campos de texto
export const CustomInput = ({ label, value, onChangeText, keyboardType = 'default', placeholder }) => (
  <View style={editarPerfilStyles.inputGroup}>
    <Text style={editarPerfilStyles.inputLabel}>{label}</Text>
    <TextInput
      style={editarPerfilStyles.textInput}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor="#CCC"
    />
  </View>
);

// Componente para la foto de perfil y el botón de cambio
export const AvatarEditor = ({ initials, onPressCamera }) => (
  <View style={editarPerfilStyles.avatarSection}>
    <View style={editarPerfilStyles.avatarWrapper}>
      <View style={editarPerfilStyles.avatarCircle}>
        <Text style={editarPerfilStyles.avatarText}>{initials}</Text>
      </View>
      <TouchableOpacity style={editarPerfilStyles.cameraBtn} onPress={onPressCamera}>
        <Ionicons name="camera" size={14} color="#FFF" />
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onPressCamera}>
      <Text style={editarPerfilStyles.changePhotoText}>Cambiar foto de perfil</Text>
    </TouchableOpacity>
  </View>
);