import { StyleSheet } from 'react-native';

const perfilStyles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' }, // Gris muy claro de fondo
  headerWhite: { 
    flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 25, paddingVertical: 14, 
    alignItems: 'center', justifyContent: 'space-between', elevation: 2, borderBottomWidth: 1, borderBottomColor: '#E1E4E8' 
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerCenter: { flex: 2, flexDirection: 'row', justifyContent: 'center', gap: 25 },
  headerRight: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  logoPI: { width: 34, height: 34, marginRight: 10 },
  brandName: { color: '#003366', fontWeight: 'bold', fontSize: 17 },
  universityText: { color: '#999', fontSize: 11, marginTop: -3 },
  navLink: { fontWeight: '600', color: '#666', fontSize: 14 },
  navLinkActive: { color: '#00d97e' },
  notifIcon: { position: 'relative', marginRight: 15 },
  badgeNotif: { position: 'absolute', top: -4, right: -4, backgroundColor: '#FF4D4D', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#00d97e', justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  contentScroll: { flex: 1 },
  scrollInner: { padding: 20, paddingBottom: 50 },
  centeredContentWeb: { maxWidth: 900, alignSelf: 'center', width: '100%' },

  // Usuario
  userRowSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 25, borderRadius: 20, marginBottom: 20, elevation: 1 },
  avatarWrapper: { position: 'relative', marginRight: 25 },
  avatarMain: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#00d97e', justifyContent: 'center', alignItems: 'center' },
  avatarMainText: { color: '#FFF', fontSize: 35, fontWeight: 'bold' },
  cameraBtn: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#333', padding: 7, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
  userMainInfo: { flex: 1 },
  textUserName: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
  textUserRole: { fontSize: 15, color: '#00d97e', fontWeight: '600', marginTop: 2 },
  textUserFaculty: { fontSize: 14, color: '#777', marginTop: 2 },
  editProfileBtn: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E1E4E8', alignSelf: 'flex-start' },
  editProfileText: { fontSize: 13, color: '#555', fontWeight: '600' },

  // Rejilla de 4 cuadros pequeños
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  smallCard: { width: '23.5%', backgroundColor: '#FFF', padding: 15, borderRadius: 15, alignItems: 'center', elevation: 1 },
  smallLabel: { fontSize: 11, color: '#999', marginTop: 8 },
  smallValue: { fontSize: 13, color: '#333', fontWeight: 'bold', marginTop: 2, textAlign: 'center' },

  // Cuadros de colores grandes
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { width: '48.5%', padding: 25, borderRadius: 20, elevation: 2 },
  statBlue: { backgroundColor: '#2D7FF9' },
  statGreen: { backgroundColor: '#00C853' },
  statValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  statDesc: { color: '#FFF', fontSize: 14, opacity: 0.9 },

  // Secciones de lista
  sectionHeading: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 12, marginLeft: 5, letterSpacing: 1 },
  whiteCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 10, marginBottom: 25, elevation: 1 },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  iconContainer: { width: 42, height: 42, backgroundColor: '#F5F7FA', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actionLabel: { fontSize: 12, color: '#999' },
  actionSub: { fontSize: 14, color: '#333', fontWeight: 'bold' },

  btnExit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 18, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FFE5E5', marginTop: 10 },
  btnExitText: { color: '#FF4D4D', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});

export default perfilStyles;