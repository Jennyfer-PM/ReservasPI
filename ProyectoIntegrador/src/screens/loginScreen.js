import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, ScrollView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authStyles from '../styles/authStyles';
import TerminosCondiciones from '../components/terminos_condiciones';

const LoginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showTerms, setShowTerms] = useState(false);
  
  const [securePass, setSecurePass] = useState(true);
  const [secureRegPass, setSecureRegPass] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const [regNombre, setRegNombre] = useState('');
  const [regAp, setRegAp] = useState('');
  const [regAm, setRegAm] = useState('');
  const [regEdad, setRegEdad] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regTel, setRegTel] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const API_URL = 'http://192.168.100.95:8000/api';

  const handleLogin = async () => {
    if (!correo || !password) {
        Alert.alert("Error", "Por favor llena todos los campos");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: correo,
                contrasena: password
            }),
        });

        const data = await response.json();

        if (response.ok) {
            navigation.replace('Main', { 
                usuario: data.usuario || 'Axel Romo', 
                idUsuario: data.id 
            });
        } else {
            Alert.alert("Error", data.detail || "Credenciales incorrectas");
        }
    } catch (error) {
        Alert.alert("Error de conexión", "Asegúrate que el backend esté corriendo");
    }
  };

  const handleRegister = async () => {
    if (!regNombre || !regCorreo || !regPass || !regAp) {
      Alert.alert("Error", "Los campos marcados son obligatorios");
      return;
    }
    if (regPass !== regConfirmPass) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (!acceptedTerms) {
      Alert.alert("Aviso", "Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: regNombre,
          ap: regAp,
          am: regAm,
          edad: parseInt(regEdad) || 0,
          correo: regCorreo,
          contrasena: regPass,
          telefono: regTel
        })
      });

      if (response.ok) {
        Alert.alert("¡Éxito!", "Cuenta creada correctamente.");
        setActiveTab('login');
      } else {
        const data = await response.json();
        Alert.alert("Error", data.detail || "No se pudo realizar el registro");
      }
    } catch (error) {
      Alert.alert("Error", "Error de conexión con el servidor.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={authStyles.container}>
      <ImageBackground source={require('../../assets/Fondo-UPQ.webp')} style={authStyles.background} resizeMode="cover">
        <View style={authStyles.overlay}>
          <Image source={require('../../assets/icon PI.png')} style={authStyles.logo} />
          <View style={authStyles.card}>
            <View style={authStyles.tabBar}>
              <TouchableOpacity style={[authStyles.tab, activeTab === 'login' && authStyles.activeTab]} onPress={() => setActiveTab('login')}>
                <Text style={[authStyles.tabText, activeTab === 'login' && authStyles.activeTabText]}>Ingresar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[authStyles.tab, activeTab === 'register' && authStyles.activeTab]} onPress={() => setActiveTab('register')}>
                <Text style={[authStyles.tabText, activeTab === 'register' && authStyles.activeTabText]}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={authStyles.formContainer} showsVerticalScrollIndicator={false}>
              {activeTab === 'login' ? (
                <View>
                  <Text style={authStyles.title}>Bienvenido a CheckPoint</Text>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Correo electrónico</Text>
                    <TextInput style={authStyles.input} placeholder="correo@upq.edu.mx" value={correo} onChangeText={setCorreo} autoCapitalize="none" />
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Contraseña</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput style={authStyles.inputPassword} secureTextEntry={securePass} placeholder="********" value={password} onChangeText={setPassword} />
                      <TouchableOpacity onPress={() => setSecurePass(!securePass)} style={authStyles.eyeIcon}>
                        <Ionicons name={securePass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity style={authStyles.btnPrimary} onPress={handleLogin}>
                    <Text style={authStyles.btnText}>Ingresar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={authStyles.title}>Crear Cuenta</Text>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Nombre(s)</Text>
                    <TextInput style={authStyles.input} placeholder="Juan" value={regNombre} onChangeText={setRegNombre} />
                  </View>
                  <View style={authStyles.row}>
                    <View style={[authStyles.inputGroup, authStyles.halfInput]}>
                      <Text style={authStyles.label}>Ap. Paterno</Text>
                      <TextInput style={authStyles.input} placeholder="Pérez" value={regAp} onChangeText={setRegAp} />
                    </View>
                    <View style={[authStyles.inputGroup, authStyles.halfInput]}>
                      <Text style={authStyles.label}>Ap. Materno</Text>
                      <TextInput style={authStyles.input} placeholder="García" value={regAm} onChangeText={setRegAm} />
                    </View>
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Correo Institucional</Text>
                    <TextInput style={authStyles.input} placeholder="ejemplo@upq.edu.mx" value={regCorreo} onChangeText={setRegCorreo} keyboardType="email-address" autoCapitalize="none" />
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Teléfono</Text>
                    <TextInput style={authStyles.input} placeholder="4421234567" value={regTel} onChangeText={setRegTel} keyboardType="phone-pad" />
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Contraseña</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput style={authStyles.inputPassword} placeholder="********" secureTextEntry={secureRegPass} value={regPass} onChangeText={setRegPass} />
                      <TouchableOpacity onPress={() => setSecureRegPass(!secureRegPass)} style={authStyles.eyeIcon}>
                        <Ionicons name={secureRegPass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Confirmar Contraseña</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput style={authStyles.inputPassword} placeholder="********" secureTextEntry={secureConfirm} value={regConfirmPass} onChangeText={setRegConfirmPass} />
                      <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={authStyles.eyeIcon}>
                        <Ionicons name={secureConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={authStyles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={[authStyles.checkbox, acceptedTerms && authStyles.checkboxActive]}>
                      {acceptedTerms && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTerms(true)}>
                      <Text style={authStyles.checkboxLabel}>Acepto los <Text style={authStyles.linkText}>términos y condiciones</Text></Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={authStyles.btnPrimary} onPress={handleRegister}>
                    <Text style={authStyles.btnText}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
      <TerminosCondiciones visible={showTerms} onClose={() => setShowTerms(false)} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;