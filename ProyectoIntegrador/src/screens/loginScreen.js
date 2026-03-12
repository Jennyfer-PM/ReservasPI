import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import authStyles from '../styles/authStyles';
import TermsModal from '../components/termsModal';

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgot, setShowForgot] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground 
        source={require('../../assets/Fondo-UPQ.webp')} // Cambia al nombre de tu imagen
        style={authStyles.background}
      >
        <View style={authStyles.overlay}>
          {/* Logo con estilo responsivo */}
          <Image 
            source={require('../../assets/icon PI.png')} // Cambia al nombre de tu logo
            style={authStyles.logo}
          />

          <View style={authStyles.card}>
            {/* Tabs dinámicas */}
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

            <ScrollView contentContainerStyle={authStyles.formContainer}>
              {showForgot ? (
                // VISTA OLVIDASTE CONTRASEÑA (Captura 2)
                <View>
                  <TouchableOpacity onPress={() => setShowForgot(false)}>
                    <Text style={{ color: '#00e676', marginBottom: 15, fontWeight: 'bold' }}>← Volver al inicio</Text>
                  </TouchableOpacity>
                  <Text style={authStyles.title}>¿Olvidaste tu contraseña?</Text>
                  <Text style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>
                    No te preocupes, ingresa tu correo institucional para recuperarla.
                  </Text>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Correo electrónico institucional</Text>
                    <TextInput style={authStyles.input} placeholder="correo@universidad.edu.mx" />
                  </View>
                  <TouchableOpacity style={authStyles.btnPrimary}>
                    <Text style={authStyles.btnText}>Enviar instrucciones</Text>
                  </TouchableOpacity>
                </View>
              ) : activeTab === 'login' ? (
                // VISTA LOGIN (Captura 1)
                <View>
                  <Text style={authStyles.title}>Bienvenido a CheckPoint</Text>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Correo electrónico</Text>
                    <TextInput style={authStyles.input} placeholder="correo@edu.com.mx" />
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Contraseña</Text>
                    <TextInput style={authStyles.input} secureTextEntry placeholder="********" />
                  </View>
                  <TouchableOpacity onPress={() => setShowForgot(true)}>
                    <Text style={authStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={authStyles.btnPrimary}>
                    <Text style={authStyles.btnText}>Ingresar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // VISTA REGISTRO (Captura 3)
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
                    <TextInput style={authStyles.input} placeholder="correo@upq.edu.mx" />
                  </View>
                  <TouchableOpacity onPress={() => setShowTerms(true)}>
                    <Text style={{ color: '#555', fontSize: 13, marginTop: 10 }}>
                      Acepto los <Text style={{ color: '#00e676', fontWeight: 'bold' }}>términos y condiciones</Text>
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={authStyles.btnPrimary}>
                    <Text style={authStyles.btnText}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <View style={authStyles.demoFooter}>
              <Text style={{ fontSize: 10, color: '#999' }}>Acceso rápido para demostración</Text>
              <View style={authStyles.badgeRow}>
                <View style={{ backgroundColor: '#f3e5f5', padding: 5, borderRadius: 5 }}><Text style={{ color: '#9c27b0', fontSize: 10 }}>Admin</Text></View>
                <View style={{ backgroundColor: '#e3f2fd', padding: 5, borderRadius: 5 }}><Text style={{ color: '#2196f3', fontSize: 10 }}>Docente</Text></View>
                <View style={{ backgroundColor: '#e8f5e9', padding: 5, borderRadius: 5 }}><Text style={{ color: '#4caf50', fontSize: 10 }}>Alumno</Text></View>
              </View>
            </View>
          </View>
          <Text style={{ color: 'white', marginTop: 20, fontSize: 11 }}>© 2026 Universidad - Todos los derechos reservados</Text>
        </View>

        <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;