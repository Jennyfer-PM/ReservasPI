import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ImageBackground, 
  Image, ScrollView, KeyboardAvoidingView, Platform, Alert, 
  Modal, FlatList, ActivityIndicator, StyleSheet, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TerminosCondiciones from '../components/terminos_condiciones';
import { API_BASE_URL } from '../constants/api';

const { width, height } = Dimensions.get('window');

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
  const [regMatricula, setRegMatricula] = useState('');
  const [regCurp, setRegCurp] = useState('');
  const [regRfc, setRegRfc] = useState('');  // NUEVO: RFC separado para docentes
  const [regCarrera, setRegCarrera] = useState(null);
  const [regCuatrimestre, setRegCuatrimestre] = useState('');
  const [regTipoUsuario, setRegTipoUsuario] = useState('alumno');
  const [regNoEmpleado, setRegNoEmpleado] = useState('');
  const [carrerasList, setCarrerasList] = useState([]);
  const [showCarrerasModal, setShowCarrerasModal] = useState(false);
  const [cargandoCarreras, setCargandoCarreras] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (regMatricula && regMatricula.length === 9 && /^\d{9}$/.test(regMatricula)) {
      setRegCorreo(`${regMatricula}@upq.edu.mx`);
    } else if (regMatricula && regMatricula.length < 9) {
      setRegCorreo('');
    }
  }, [regMatricula]);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        setCargandoCarreras(true);
        const response = await fetch(`${API_BASE_URL}/carreras`);
        if (response.ok) {
          const data = await response.json();
          setCarrerasList(data);
        }
      } catch (error) {
        console.error("Error cargando carreras:", error);
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
        console.log("Intentando login con:", correo);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena: password }),
        });

        const data = await response.json();
        console.log("Respuesta login:", data);

        if (response.ok) {
            console.log("Login exitoso - ID:", data.id, "Tipo:", data.tipo);
            
            // Redirigir según el tipo de usuario
            if (data.tipo === 'docente') {
                console.log("Navegando a MainDocente con:", { 
                    usuario: data.usuario, 
                    idUsuario: data.id, 
                    tipoUsuario: data.tipo 
                });
                navigation.replace('MainDocente', { 
                    usuario: data.usuario,
                    idUsuario: data.id,
                    tipoUsuario: data.tipo
                });
            } else if (data.tipo === 'administrador') {
                navigation.replace('MainAdmin', { 
                    usuario: data.usuario,
                    idUsuario: data.id,
                    tipoUsuario: data.tipo
                });
            } else {
                navigation.replace('MainAlumno', { 
                    usuario: data.usuario,
                    idUsuario: data.id,
                    tipoUsuario: data.tipo || 'alumno'
                });
            }
        } else {
            Alert.alert("Error", data.detail || "Credenciales incorrectas");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        Alert.alert("Error de conexión", "Asegúrate que el backend esté corriendo");
    }
};

  const handleRegister = async () => {
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

    if (regTipoUsuario === 'alumno') {
      if (!regMatricula || !regCurp || !regCarrera || !regCuatrimestre) {
        Alert.alert("Error", "Completa todos los campos de alumno");
        return;
      }
      if (!/^\d{9}$/.test(regMatricula)) {
        Alert.alert("Error", "La matrícula debe tener 9 dígitos");
        return;
      }
      if (regCurp.length !== 18) {
        Alert.alert("Error", "El CURP debe tener 18 caracteres");
        return;
      }
      const cuatrimestre = parseInt(regCuatrimestre);
      if (isNaN(cuatrimestre) || cuatrimestre < 1 || cuatrimestre > 12) {
        Alert.alert("Error", "El cuatrimestre debe estar entre 1 y 12");
        return;
      }
    } else {
      if (!regNoEmpleado) {
        Alert.alert("Error", "El número de empleado es obligatorio");
        return;
      }
      if (!/^\d{7}$/.test(regNoEmpleado)) {
        Alert.alert("Error", "El número de empleado debe tener 7 dígitos");
        return;
      }
      // RFC opcional pero si se ingresa, validar longitud
      if (regRfc && regRfc.length !== 13 && regRfc.length !== 0) {
        Alert.alert("Error", "El RFC debe tener 13 caracteres");
        return;
      }
    }

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
        bodyData.rfc = regRfc.toUpperCase() || '';  // Usar regRfc separado
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
        setRegRfc('');
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
    <Modal visible={showCarrerasModal} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona tu carrera</Text>
            <TouchableOpacity onPress={() => setShowCarrerasModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {cargandoCarreras ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#00d97e" />
              <Text style={styles.loaderText}>Cargando carreras...</Text>
            </View>
          ) : (
            <FlatList
              data={carrerasList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, regCarrera === item.id && styles.modalItemActive]}
                  onPress={() => {
                    setRegCarrera(item.id);
                    setShowCarrerasModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, regCarrera === item.id && styles.modalItemTextActive]}>
                    {item.nombre}
                  </Text>
                  {regCarrera === item.id && (
                    <Ionicons name="checkmark" size={20} color="#00d97e" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.modalEmpty}>No hay carreras disponibles</Text>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ImageBackground source={require('../../assets/Fondo-UPQ.webp')} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <Image source={require('../../assets/icon PI.png')} style={styles.logo} />
          <View style={styles.card}>
            <View style={styles.tabBar}>
              <TouchableOpacity style={[styles.tab, activeTab === 'login' && styles.activeTab]} onPress={() => setActiveTab('login')}>
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Ingresar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, activeTab === 'register' && styles.activeTab]} onPress={() => setActiveTab('register')}>
                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
              {activeTab === 'login' ? (
                <View>
                  <Text style={styles.title}>Bienvenido a CheckPoint</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Correo electrónico *</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="correo@upq.edu.mx" 
                      value={correo} 
                      onChangeText={setCorreo} 
                      autoCapitalize="none" 
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contraseña *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput 
                        style={styles.inputPassword} 
                        secureTextEntry={securePass} 
                        placeholder="********" 
                        value={password} 
                        onChangeText={setPassword} 
                      />
                      <TouchableOpacity onPress={() => setSecurePass(!securePass)} style={styles.eyeIcon}>
                        <Ionicons name={securePass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
                    <Text style={styles.btnText}>Ingresar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={styles.title}>Crear Cuenta</Text>
                  
                  <View style={styles.userTypeContainer}>
                    <TouchableOpacity 
                      style={[styles.userTypeButton, regTipoUsuario === 'alumno' && styles.userTypeButtonActive]}
                      onPress={() => setRegTipoUsuario('alumno')}
                    >
                      <Ionicons name="school-outline" size={20} color={regTipoUsuario === 'alumno' ? "#fff" : "#666"} />
                      <Text style={[styles.userTypeText, regTipoUsuario === 'alumno' && styles.userTypeTextActive]}>Alumno</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.userTypeButton, regTipoUsuario === 'docente' && styles.userTypeButtonActive]}
                      onPress={() => setRegTipoUsuario('docente')}
                    >
                      <Ionicons name="person-outline" size={20} color={regTipoUsuario === 'docente' ? "#fff" : "#666"} />
                      <Text style={[styles.userTypeText, regTipoUsuario === 'docente' && styles.userTypeTextActive]}>Docente</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre(s) *</Text>
                    <TextInput style={styles.input} placeholder="Juan" value={regNombre} onChangeText={setRegNombre} />
                  </View>
                  
                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.halfInput]}>
                      <Text style={styles.label}>Ap. Paterno *</Text>
                      <TextInput style={styles.input} placeholder="Pérez" value={regAp} onChangeText={setRegAp} />
                    </View>
                    <View style={[styles.inputGroup, styles.halfInput]}>
                      <Text style={styles.label}>Ap. Materno</Text>
                      <TextInput style={styles.input} placeholder="García" value={regAm} onChangeText={setRegAm} />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Edad *</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="18" 
                      value={regEdad} 
                      onChangeText={setRegEdad} 
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Correo Institucional *</Text>
                    <View style={styles.readonlyContainer}>
                      <TextInput 
                        style={[styles.input, styles.inputReadonly]} 
                        placeholder="Se generará con tu matrícula" 
                        value={regCorreo} 
                        editable={false}
                      />
                      <Ionicons name="mail-outline" size={20} color="#00d97e" style={styles.inputIcon} />
                    </View>
                    <Text style={styles.helperText}>
                      El correo se genera automáticamente: {regMatricula ? `${regMatricula}@upq.edu.mx` : "123456789@upq.edu.mx"}
                    </Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="4421234567" 
                      value={regTel} 
                      onChangeText={setRegTel} 
                      keyboardType="phone-pad" 
                    />
                  </View>

                  {regTipoUsuario === 'alumno' ? (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Matrícula *</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="123456789" 
                          value={regMatricula} 
                          onChangeText={setRegMatricula} 
                          keyboardType="numeric"
                          maxLength={9}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>CURP *</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="GOPJ051214HDFLPR09" 
                          value={regCurp} 
                          onChangeText={setRegCurp} 
                          autoCapitalize="characters"
                          maxLength={18}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Carrera *</Text>
                        <TouchableOpacity 
                          style={styles.selectorInput}
                          onPress={() => setShowCarrerasModal(true)}
                        >
                          <Text style={[styles.selectorText, !regCarrera && styles.selectorPlaceholder]}>
                            {regCarrera 
                              ? carrerasList.find(c => c.id === regCarrera)?.nombre || "Seleccionar carrera"
                              : cargandoCarreras ? "Cargando carreras..." : "Selecciona tu carrera"}
                          </Text>
                          <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cuatrimestre *</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="1-12" 
                          value={regCuatrimestre} 
                          onChangeText={setRegCuatrimestre} 
                          keyboardType="numeric"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Número de Empleado *</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="1001234" 
                          value={regNoEmpleado} 
                          onChangeText={setRegNoEmpleado} 
                          keyboardType="numeric"
                          maxLength={7}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>RFC (opcional)</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="GOPJ051214HVZ" 
                          value={regRfc} 
                          onChangeText={setRegRfc} 
                          autoCapitalize="characters"
                          maxLength={13}
                        />
                      </View>
                    </>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contraseña *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput 
                        style={styles.inputPassword} 
                        placeholder="********" 
                        secureTextEntry={secureRegPass} 
                        value={regPass} 
                        onChangeText={setRegPass} 
                      />
                      <TouchableOpacity onPress={() => setSecureRegPass(!secureRegPass)} style={styles.eyeIcon}>
                        <Ionicons name={secureRegPass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar Contraseña *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput 
                        style={styles.inputPassword} 
                        placeholder="********" 
                        secureTextEntry={secureConfirm} 
                        value={regConfirmPass} 
                        onChangeText={setRegConfirmPass} 
                      />
                      <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={styles.eyeIcon}>
                        <Ionicons name={secureConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
                      {acceptedTerms && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTerms(true)}>
                      <Text style={styles.checkboxLabel}>Acepto los <Text style={styles.linkText}>términos y condiciones</Text></Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
                    <Text style={styles.btnText}>Registrarse</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000'
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    maxHeight: 100,
    maxWidth: 100,
    borderRadius: 50,
    marginBottom: 20
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width > 600 ? 450 : '95%',
    maxHeight: height * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden'
  },
  tabBar: {
    flexDirection: 'row',
    height: 55
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0'
  },
  activeTab: {
    backgroundColor: '#00e676'
  },
  tabText: {
    fontWeight: 'bold',
    color: '#888'
  },
  activeTabText: {
    color: '#FFF'
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginBottom: 25
  },
  inputGroup: {
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfInput: {
    width: '48%'
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    position: 'relative'
  },
  inputPassword: {
    flex: 1,
    padding: 12,
    paddingRight: 45,
    fontSize: 16,
    color: '#333'
  },
  eyeIcon: {
    position: 'absolute',
    right: 15
  },
  btnPrimary: {
    backgroundColor: '#00e676',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxActive: {
    backgroundColor: '#333',
    borderColor: '#333'
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#555'
  },
  linkText: {
    color: '#00e676',
    fontWeight: 'bold'
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5'
  },
  userTypeButtonActive: {
    backgroundColor: '#00d97e',
    borderColor: '#00d97e'
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  userTypeTextActive: {
    color: '#fff'
  },
  selectorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12
  },
  selectorText: {
    fontSize: 16,
    color: '#333'
  },
  selectorPlaceholder: {
    color: '#999'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  modalItemActive: {
    backgroundColor: '#E8F5E9'
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  modalItemTextActive: {
    color: '#00d97e',
    fontWeight: '600'
  },
  modalEmpty: {
    textAlign: 'center',
    padding: 20,
    color: '#999'
  },
  helperText: {
    fontSize: 11,
    color: '#888',
    marginTop: 5,
    marginLeft: 5
  },
  readonlyContainer: {
    position: 'relative',
    width: '100%'
  },
  inputReadonly: {
    backgroundColor: '#f0f0f0',
    color: '#1e293b',
    borderColor: '#e2e8f0',
    paddingRight: 40,
    fontWeight: '500'
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 14
  },
  loaderContainer: {
    padding: 40,
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 10,
    color: '#666'
  }
});

export default LoginScreen;