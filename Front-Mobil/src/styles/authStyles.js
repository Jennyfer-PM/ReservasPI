import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    maxHeight: 100,
    maxWidth: 100,
    borderRadius: 50,
    marginBottom: 20,
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
    overflow: 'hidden',
  },
  tabBar: { flexDirection: 'row', height: 55 },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  activeTab: { backgroundColor: '#00e676' },
  tabText: { fontWeight: 'bold', color: '#888' },
  activeTabText: { color: '#FFF' },
  formContainer: { paddingHorizontal: 25, paddingVertical: 30 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginBottom: 25,
  },
  inputGroup: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    position: 'relative',
  },
  inputPassword: {
    flex: 1,
    padding: 12,
    paddingRight: 45,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  forgotText: {
    color: '#00e676',
    textAlign: 'right',
    marginTop: 5,
    fontSize: 13,
    fontWeight: '600',
  },
  btnPrimary: {
    backgroundColor: '#00e676',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  checkboxLabel: { fontSize: 13, color: '#555' },
  linkText: { color: '#00e676', fontWeight: 'bold' },
  demoFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    padding: 20,
    alignItems: 'center',
  },
  badgeRow: { flexDirection: 'row', marginTop: 10, gap: 8 },
  badgeAdmin: { backgroundColor: '#f3e5f5', padding: 8, borderRadius: 8 },
  badgeDocente: { backgroundColor: '#e3f2fd', padding: 8, borderRadius: 8 },
  badgeAlumno: { backgroundColor: '#e8f5e9', padding: 8, borderRadius: 8 },
  badgeTextAdmin: { color: '#9c27b0', fontSize: 12, fontWeight: '600' },
  badgeTextDocente: { color: '#2196f3', fontSize: 12, fontWeight: '600' },
  badgeTextAlumno: { color: '#4caf50', fontSize: 12, fontWeight: '600' },
  footerCopyright: { color: 'white', marginTop: 15, fontSize: 11, textAlign: 'center' },

  // ========== NUEVOS ESTILOS PARA REGISTRO ==========
  
  // Selector de tipo de usuario (Alumno/Docente)
  userTypeContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
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
    backgroundColor: '#F5F5F5',
  },
  userTypeButtonActive: {
    backgroundColor: '#00d97e',
    borderColor: '#00d97e',
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  userTypeTextActive: {
    color: '#fff',
  },

  // Selector de carrera (input con ícono)
  selectorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  selectorPlaceholder: {
    color: '#999',
  },

  // Modal para seleccionar carrera
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemActive: {
    backgroundColor: '#E8F5E9',
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  modalItemTextActive: {
    color: '#00d97e',
    fontWeight: '600',
  },
  modalEmpty: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
  },

  // Estilos adicionales
  pickerContainer: {
    position: 'relative',
    width: '100%',
  },
  pickerButton: {
    position: 'absolute',
    right: 15,
    top: 12,
    padding: 5,
  },
  helperText: {
    fontSize: 11,
    color: '#888',
    marginTop: 5,
    marginLeft: 5,
  },
  // Separador visual
  sectionSeparator: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  // Mensaje de error
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  // Scroll view content
  scrollContent: {
    paddingBottom: 30,
  },
  readonlyContainer: {
    position: 'relative',
    width: '100%',
  },
  inputReadonly: {
    backgroundColor: '#f0f0f0',
    color: '#1e293b',
    borderColor: '#e2e8f0',
    paddingRight: 40,
    fontWeight: '500',
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 14,
},
});