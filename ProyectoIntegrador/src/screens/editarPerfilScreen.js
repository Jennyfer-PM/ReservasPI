import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import editarPerfilStyles from '../styles/editarPerfilStyles';
import { CustomInput, AvatarEditor } from '../components/editarPerfilComponents';

const editarPerfilScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('Ana Martínez');
    const [telefono, setTelefono] = useState('442 123 4567');

    return (
        <View style={editarPerfilStyles.mainContainer}>
        {/* Header */}
        <View style={editarPerfilStyles.headerWhite}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={editarPerfilStyles.headerLeft}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={editarPerfilStyles.headerTitle}>Editar Perfil</Text>
            <View style={editarPerfilStyles.headerRight} />
        </View>

        <ScrollView contentContainerStyle={editarPerfilStyles.scrollInner}>
            <View style={editarPerfilStyles.centeredContent}>
            
            <AvatarEditor 
                initials="AM" 
                onPressCamera={() => console.log("Cambiar foto")} 
            />

            <Text style={editarPerfilStyles.sectionLabel}>DATOS PERSONALES</Text>
            <View style={editarPerfilStyles.formCard}>
                <CustomInput 
                label="Nombre Completo" 
                value={nombre} 
                onChangeText={setNombre} 
                />
                <CustomInput 
                label="Teléfono" 
                value={telefono} 
                onChangeText={setTelefono} 
                keyboardType="phone-pad" 
                />
            </View>

            {/* Botones */}
            <View style={editarPerfilStyles.buttonRow}>
                <TouchableOpacity style={editarPerfilStyles.btnCancel} onPress={() => navigation.goBack()}>
                <Text style={editarPerfilStyles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={editarPerfilStyles.btnSave} onPress={() => navigation.goBack()}>
                <Text style={editarPerfilStyles.btnSaveText}>Guardar</Text>
                </TouchableOpacity>
            </View>

            </View>
        </ScrollView>
        </View>
    );
};

export default editarPerfilScreen;