import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ImageBackground, 
  Image, ScrollView, KeyboardAvoidingView, Platform, Alert, 
  Modal, FlatList, ActivityIndicator  // ✅ Agregar ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authStyles from '../styles/authStyles';
import TerminosCondiciones from '../components/terminos_condiciones';
import { API_BASE_URL } from '../constants/api';

const LoginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showTerms, setShowTerms] = useState(false);
  
  const [securePass, setSecurePass] = useState(true);
  const [secureRegPass, setSecureRegPass] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  // Login fields
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  // Registro fields
  const [regNombre, setRegNombre] = useState('');
  const [regAp, setRegAp] = useState('');
  const [regAm, setRegAm] = useState('');
  const [regEdad, setRegEdad] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regTel, setRegTel] = useState('');
  const [regMatricula, setRegMatricula] = useState('');
  const [regCurp, setRegCurp] = useState('');
  const [regCarrera, setRegCarrera] = useState(null);
  const [regCuatrimestre, setRegCuatrimestre] = useState('');
  const [regTipoUsuario, setRegTipoUsuario] = useState('alumno');
  const [regNoEmpleado, setRegNoEmpleado] = useState('');
  
  // Lista de carreras
  const [carrerasList, setCarrerasList] = useState([]);
  const [showCarrerasModal, setShowCarrerasModal] = useState(false);
  const [cargandoCarreras, setCargandoCarreras] = useState(true); // ✅ Estado de carga
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ✅ EFECTO: Generar correo automático a partir de la matrícula
  useEffect(() => {
    if (regMatricula && regMatricula.length === 9 && /^\d{9}$/.test(regMatricula)) {
      const nuevoCorreo = `${regMatricula}@upq.edu.mx`;
      setRegCorreo(nuevoCorreo);
    } else if (regMatricula && regMatricula.length < 9) {
      setRegCorreo('');
    }
  }, [regMatricula]);

  // Obtener lista de carreras al cargar
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        setCargandoCarreras(true);
        console.log("Cargando carreras...");
        const response = await fetch(`${API_BASE_URL}/carreras`);
        console.log("Respuesta status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Carreras cargadas:", data);
          setCarrerasList(data);
        } else {
          console.error("Error al cargar carreras:", response.status);
        }
      } catch (error) {
        console.error("Error de red al cargar carreras:", error);
      } finally {
        setCargandoCarreras(false);
      }
    };
    fetchCarreras();
  }, []);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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
          usuario: data.usuario || 'Usuario', 
          idUsuario: data.id,
          tipoUsuario: data.tipo || 'alumno'
        });
      } else {
        Alert.alert("Error", data.detail || "Credenciales incorrectas");
      }
    } catch (error) {
      Alert.alert("Error de conexión", "Asegúrate que el backend esté corriendo");
    }
  };

  const handleRegister = async () => {
    // Validaciones básicas
    if (!regNombre || !regAp || !regCorreo || !regPass) {
      Alert.alert("Error", "Los campos marcados con * son obligatorios");
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

    // Validaciones según tipo de usuario
    if (regTipoUsuario === 'alumno') {
      if (!regMatricula || !regCurp || !regCarrera || !regCuatrimestre) {
        Alert.alert("Error", "Completa todos los campos de alumno");
        return;
      }
      
      // Validar matrícula (9 dígitos)
      if (!/^\d{9}$/.test(regMatricula)) {
        Alert.alert("Error", "La matrícula debe tener 9 dígitos");
        return;
      }
      
      
      
      // Validar cuatrimestre
      const cuatrimestre = parseInt(regCuatrimestre);
      if (isNaN(cuatrimestre) || cuatrimestre < 1 || cuatrimestre > 12) {
        Alert.alert("Error", "El cuatrimestre debe estar entre 1 y 12");
        return;
      }
    } else {
      // Validaciones para docente
      if (!regNoEmpleado) {
        Alert.alert("Error", "El número de empleado es obligatorio para docentes");
        return;
      }
      
      if (!/^\d{7}$/.test(regNoEmpleado)) {
        Alert.alert("Error", "El número de empleado debe tener 7 dígitos");
        return;
      }
    }

    // Validar edad
    const edad = parseInt(regEdad);
    if (isNaN(edad) || edad < 17 || edad > 100) {
      Alert.alert("Error", "La edad debe estar entre 17 y 100 años");
      return;
    }

    try {
      const bodyData = {
        nombre: regNombre,
        ap: regAp,
        am: regAm,
        edad: edad,
        correo: regCorreo,
        contrasena: regPass,
        telefono: regTel,
        tipo_usuario: regTipoUsuario
      };
      
      if (regTipoUsuario === 'alumno') {
        bodyData.matricula = regMatricula;
        bodyData.curp = regCurp.toUpperCase();
        bodyData.id_carrera = regCarrera;
        bodyData.cuatrimestre = parseInt(regCuatrimestre);
      } else {
        bodyData.no_empleado = regNoEmpleado;
        bodyData.rfc = regCurp.toUpperCase();
      }
      
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("¡Éxito!", "Cuenta creada correctamente. Ahora puedes iniciar sesión.");
        setActiveTab('login');
        // Limpiar formulario
        setRegNombre('');
        setRegAp('');
        setRegAm('');
        setRegEdad('');
        setRegCorreo('');
        setRegPass('');
        setRegConfirmPass('');
        setRegTel('');
        setRegMatricula('');
        setRegCurp('');
        setRegCarrera(null);
        setRegCuatrimestre('');
        setRegNoEmpleado('');
        setAcceptedTerms(false);
      } else {
        Alert.alert("Error", data.detail || "No se pudo realizar el registro");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error", "Error de conexión con el servidor.");
    }
  };

  const CarreraSelector = () => (
    <Modal
      visible={showCarrerasModal}
      transparent={true}
      animationType="slide"
    >
      <View style={authStyles.modalOverlay}>
        <View style={authStyles.modalContainer}>
          <View style={authStyles.modalHeader}>
            <Text style={authStyles.modalTitle}>Selecciona tu carrera</Text>
            <TouchableOpacity onPress={() => setShowCarrerasModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {cargandoCarreras ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#00d97e" />
              <Text style={{ marginTop: 10, color: '#666' }}>Cargando carreras...</Text>
            </View>
          ) : (
            <FlatList
              data={carrerasList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    authStyles.modalItem,
                    regCarrera === item.id && authStyles.modalItemActive
                  ]}
                  onPress={() => {
                    setRegCarrera(item.id);
                    setShowCarrerasModal(false);
                  }}
                >
                  <Text style={[
                    authStyles.modalItemText,
                    regCarrera === item.id && authStyles.modalItemTextActive
                  ]}>
                    {item.nombre}
                  </Text>
                  {regCarrera === item.id && (
                    <Ionicons name="checkmark" size={20} color="#00d97e" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={authStyles.modalEmpty}>No hay carreras disponibles</Text>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );

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
                    <Text style={authStyles.label}>Correo electrónico *</Text>
                    <TextInput 
                      style={authStyles.input} 
                      placeholder="correo@upq.edu.mx" 
                      value={correo} 
                      onChangeText={setCorreo} 
                      autoCapitalize="none" 
                    />
                  </View>
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Contraseña *</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput 
                        style={authStyles.inputPassword} 
                        secureTextEntry={securePass} 
                        placeholder="********" 
                        value={password} 
                        onChangeText={setPassword} 
                      />
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
                  
                  {/* Selector de Tipo de Usuario */}
                  <View style={authStyles.userTypeContainer}>
                    <TouchableOpacity 
                      style={[
                        authStyles.userTypeButton,
                        regTipoUsuario === 'alumno' && authStyles.userTypeButtonActive
                      ]}
                      onPress={() => setRegTipoUsuario('alumno')}
                    >
                      <Ionicons 
                        name="school-outline" 
                        size={20} 
                        color={regTipoUsuario === 'alumno' ? "#fff" : "#666"} 
                      />
                      <Text style={[
                        authStyles.userTypeText,
                        regTipoUsuario === 'alumno' && authStyles.userTypeTextActive
                      ]}>Alumno</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        authStyles.userTypeButton,
                        regTipoUsuario === 'docente' && authStyles.userTypeButtonActive
                      ]}
                      onPress={() => setRegTipoUsuario('docente')}
                    >
                      <Ionicons 
                        name="person-outline" 
                        size={20} 
                        color={regTipoUsuario === 'docente' ? "#fff" : "#666"} 
                      />
                      <Text style={[
                        authStyles.userTypeText,
                        regTipoUsuario === 'docente' && authStyles.userTypeTextActive
                      ]}>Docente</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Información Personal (Común) */}
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Nombre(s) *</Text>
                    <TextInput style={authStyles.input} placeholder="Juan" value={regNombre} onChangeText={setRegNombre} />
                  </View>
                  
                  <View style={authStyles.row}>
                    <View style={[authStyles.inputGroup, authStyles.halfInput]}>
                      <Text style={authStyles.label}>Ap. Paterno *</Text>
                      <TextInput style={authStyles.input} placeholder="Pérez" value={regAp} onChangeText={setRegAp} />
                    </View>
                    <View style={[authStyles.inputGroup, authStyles.halfInput]}>
                      <Text style={authStyles.label}>Ap. Materno</Text>
                      <TextInput style={authStyles.input} placeholder="García" value={regAm} onChangeText={setRegAm} />
                    </View>
                  </View>

                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Edad *</Text>
                    <TextInput 
                      style={authStyles.input} 
                      placeholder="18" 
                      value={regEdad} 
                      onChangeText={setRegEdad} 
                      keyboardType="numeric"
                    />
                  </View>

                  {/* ✅ CAMPO DE CORREO - SOLO LECTURA (se genera automáticamente) */}
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Correo Institucional *</Text>
                    <View style={authStyles.readonlyContainer}>
                      <TextInput 
                        style={[authStyles.input, authStyles.inputReadonly]} 
                        placeholder="Se generará con tu matrícula" 
                        value={regCorreo} 
                        editable={false}
                      />
                      <Ionicons name="mail-outline" size={20} color="#00d97e" style={authStyles.inputIcon} />
                    </View>
                    <Text style={authStyles.helperText}>
                      El correo se genera automáticamente: {regMatricula ? `${regMatricula}@upq.edu.mx` : "123456789@upq.edu.mx"}
                    </Text>
                  </View>

                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Teléfono</Text>
                    <TextInput 
                      style={authStyles.input} 
                      placeholder="4421234567" 
                      value={regTel} 
                      onChangeText={setRegTel} 
                      keyboardType="phone-pad" 
                    />
                  </View>

                  {/* Campos según tipo de usuario */}
                  {regTipoUsuario === 'alumno' ? (
                    <>
                      <View style={authStyles.inputGroup}>
                        <Text style={authStyles.label}>Matrícula *</Text>
                        <TextInput 
                          style={authStyles.input} 
                          placeholder="123456789" 
                          value={regMatricula} 
                          onChangeText={setRegMatricula} 
                          keyboardType="numeric"
                          maxLength={9}
                        />
                        <Text style={authStyles.helperText}>
                          📧 Tu correo será: {regMatricula && regMatricula.length === 9 ? `${regMatricula}@upq.edu.mx` : "123456789@upq.edu.mx"}
                        </Text>
                      </View>

                      <View style={authStyles.inputGroup}>
                        <Text style={authStyles.label}>CURP *</Text>
                        <TextInput 
                          style={authStyles.input} 
                          placeholder="GOPJ051214HDFLPR09" 
                          value={regCurp} 
                          onChangeText={setRegCurp} 
                          autoCapitalize="characters"
                          maxLength={18}
                        />
                      </View>

                      <View style={authStyles.inputGroup}>
                        <Text style={authStyles.label}>Carrera *</Text>
                        <TouchableOpacity 
                          style={authStyles.selectorInput}
                          onPress={() => setShowCarrerasModal(true)}
                        >
                          <Text style={[
                            authStyles.selectorText,
                            !regCarrera && authStyles.selectorPlaceholder
                          ]}>
                            {regCarrera 
                              ? carrerasList.find(c => c.id === regCarrera)?.nombre || "Seleccionar carrera"
                              : cargandoCarreras ? "Cargando carreras..." : "Selecciona tu carrera"}
                          </Text>
                          <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                      </View>

                      <View style={authStyles.inputGroup}>
                        <Text style={authStyles.label}>Cuatrimestre *</Text>
                        <TextInput 
                          style={authStyles.input} 
                          placeholder="1-12" 
                          value={regCuatrimestre} 
                          onChangeText={setRegCuatrimestre} 
                          keyboardType="numeric"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={authStyles.inputGroup}>
                        <Text style={authStyles.label}>Número de Empleado *</Text>
                        <TextInput 
                          style={authStyles.input} 
                          placeholder="1001234" 
                          value={regNoEmpleado} 
                          onChangeText={setRegNoEmpleado} 
                          keyboardType="numeric"
                          maxLength={7}
                        />
                      </View>

                      <View style={authStyles.inputGroup}>
                        <Text style={authStyles.label}>RFC (opcional)</Text>
                        <TextInput 
                          style={authStyles.input} 
                          placeholder="GOPJ051214HVZ" 
                          value={regCurp} 
                          onChangeText={setRegCurp} 
                          autoCapitalize="characters"
                          maxLength={13}
                        />
                      </View>
                    </>
                  )}

                  {/* Contraseñas */}
                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Contraseña *</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput 
                        style={authStyles.inputPassword} 
                        placeholder="********" 
                        secureTextEntry={secureRegPass} 
                        value={regPass} 
                        onChangeText={setRegPass} 
                      />
                      <TouchableOpacity onPress={() => setSecureRegPass(!secureRegPass)} style={authStyles.eyeIcon}>
                        <Ionicons name={secureRegPass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={authStyles.inputGroup}>
                    <Text style={authStyles.label}>Confirmar Contraseña *</Text>
                    <View style={authStyles.passwordContainer}>
                      <TextInput 
                        style={authStyles.inputPassword} 
                        placeholder="********" 
                        secureTextEntry={secureConfirm} 
                        value={regConfirmPass} 
                        onChangeText={setRegConfirmPass} 
                      />
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
      <CarreraSelector />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;