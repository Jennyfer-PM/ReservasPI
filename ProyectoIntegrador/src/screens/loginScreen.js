import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authStyles from '../styles/authStyles';
import TerminosCondiciones from '../components/terminos_condiciones';

const loginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgot, setShowForgot] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  const [securePass, setSecurePass] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleLogin = () => {
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.container}
    >
      <ImageBackground 
        source={require('../../assets/Fondo-UPQ.webp')} 
        style={authStyles.background}
        resizeMode="cover"
      >
        <View style={authStyles.overlay}>
          <Image 
            source={require('../../assets/icon PI.png')} 
            style={authStyles.logo}
          />

          <View style={authStyles.card}>
            <View style={authStyles.tabBar}>
              <TouchableOpacity 
                style={[authStyles.tab, activeTab === 'login' && authStyles.activeTab]}
                onPress={() => { setActiveTab('login'); setShowForgot(false); }}
              >
                <Text style={[authStyles.tabText, activeTab === 'login' && authStyles.activeTabText]}>Ingresar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[authStyles.tab, activeTab === 'register' && authStyles.activeTab]}
                onPress={() => setActiveTab('register')}
              >
                <Text style={[authStyles.tabText, activeTab === 'register' && authStyles.activeTabText]}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={authStyles.formContainer} showsVerticalScrollIndicator={false}>
              {activeTab === 'login' ? (
                <View>
                  <Text style={authStyles.title}>Bienvenido a CheckPoint</Text>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Correo electrónico</Text>
                    <TextInput style={authStyles.input} placeholder="correo@edu.com.mx" keyboardType="email-address" />
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Contraseña</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput 
                        style={authStyles.inputPassword} 
                        secureTextEntry={securePass} 
                        placeholder="********" 
                      />
                      <TouchableOpacity style={authStyles.eyeIcon} onPress={() => setSecurePass(!securePass)}>
                        <Ionicons name={securePass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowForgot(true)}>
                    <Text style={authStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={authStyles.btnPrimary} onPress={handleLogin}>
                    <Text style={authStyles.btnText}>Ingresar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={authStyles.title}>Crear Cuenta</Text>
                  <View style={authStyles.row}>
                    <View style={[authStyles.inputGroup, authStyles.halfInput]}>
                      <Text style={authStyles.label}>Nombre(s)</Text>
                      <TextInput style={authStyles.input} placeholder="Nombre" />
                    </View>
                    <View style={[authStyles.inputGroup, authStyles.halfInput]}>
                      <Text style={authStyles.label}>Apellidos</Text>
                      <TextInput style={authStyles.input} placeholder="Apellidos" />
                    </View>
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Correo Electrónico</Text>
                    <TextInput style={authStyles.input} placeholder="correo@upq.edu.mx" keyboardType="email-address" />
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Contraseña</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput 
                        style={authStyles.inputPassword} 
                        placeholder="8 caracteres mínimo" 
                        secureTextEntry={securePass} 
                      />
                      <TouchableOpacity style={authStyles.eyeIcon} onPress={() => setSecurePass(!securePass)}>
                        <Ionicons name={securePass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Confirmar Contraseña</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput 
                        style={authStyles.inputPassword} 
                        placeholder="Repite tu contraseña" 
                        secureTextEntry={secureConfirm} 
                      />
                      <TouchableOpacity style={authStyles.eyeIcon} onPress={() => setSecureConfirm(!secureConfirm)}>
                        <Ionicons name={secureConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={authStyles.checkboxContainer}>
                    <TouchableOpacity 
                      style={[authStyles.checkbox, acceptedTerms && authStyles.checkboxActive]}
                      onPress={() => setAcceptedTerms(!acceptedTerms)}
                    >
                      {acceptedTerms && <Ionicons name="checkmark" size={14} color="white" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTerms(true)}>
                      <Text style={authStyles.checkboxLabel}>
                        Acepto los <Text style={authStyles.linkText}>términos y condiciones</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={authStyles.btnPrimary} onPress={handleLogin}>
                    <Text style={authStyles.btnText}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <View style={authStyles.demoFooter}>
              <Text style={{ fontSize: 10, color: '#999' }}>Acceso rápido para demostración</Text>
              <View style={authStyles.badgeRow}>
                <TouchableOpacity style={authStyles.badgeAdmin}>
                  <Text style={authStyles.badgeTextAdmin}>Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={authStyles.badgeDocente}>
                  <Text style={authStyles.badgeTextDocente}>Docente</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={authStyles.badgeAlumno}
                  onPress={() => navigation.replace('Main')}
                >
                  <Text style={authStyles.badgeTextAlumno}>Alumno</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={authStyles.footerCopyright}>© 2026 Universidad - Todos los derechos reservados</Text>
        </View>
      </ImageBackground>
      <TerminosCondiciones visible={showTerms} onClose={() => setShowTerms(false)} />
    </KeyboardAvoidingView>
  );
};

export default loginScreen;