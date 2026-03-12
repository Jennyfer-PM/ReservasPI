import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // Contenedor principal con imagen de fondo
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Logo Responsivo
  logo: {
    width: width * 0.2, // El logo escala según el ancho de pantalla
    height: width * 0.2,
    maxHeight: 100,
    maxWidth: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  // Tarjeta (Card) Responsiva
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width > 600 ? 500 : '95%', // Si es tablet/PC es fijo, si es móvil es casi todo el ancho
    maxHeight: height * 0.85, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  // Tabs Superiores
  tabBar: {
    flexDirection: 'row',
    height: 55,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#00e676', // El verde de CheckPoint
  },
  tabText: {
    fontWeight: 'bold',
    color: '#888',
  },
  activeTabText: {
    color: '#FFF',
  },
  // Contenido de los formularios
  formContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
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
  // Botones
  btnPrimary: {
    backgroundColor: '#00e676',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: "#00e676",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#00e676',
    textAlign: 'right',
    marginTop: 5,
    fontSize: 14,
  },
  // Footer de demostración (Admin, Docente, Alumno)
  demoFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    padding: 20,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  }
});