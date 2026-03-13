import { StyleSheet } from 'react-native';

const misTalleresStyles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f8f9fa' },
    headerWhite: { 
        backgroundColor: '#FFFFFF', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#edf2f7'
    },
    // Estilos de Header iguales a tu pantalla de Espacios
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    logoPI: { width: 35, height: 35, marginRight: 10 },
    brandName: { fontWeight: 'bold', fontSize: 16, color: '#003366' },
    universityText: { fontSize: 10, color: '#999' },
    headerCenter: { flexDirection: 'row', gap: 20 },
    navLink: { fontSize: 14, color: '#666' },
    navLinkActive: { color: '#00d870', fontWeight: 'bold' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    headerAvatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#00d870', justifyContent: 'center', alignItems: 'center' },
    headerAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

    contentScroll: { flex: 1 },
    centeredContentWeb: { width: '80%', alignSelf: 'center', paddingVertical: 30 },
    mobilePadding: { padding: 20 },
    
    mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 5 },
    subTitle: { fontSize: 14, color: '#666', marginBottom: 30 },
    
    // Rectángulos con fondo de color sólido
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
    statCard: { 
        width: '23.5%', // 4 por fila en Web
        padding: 20, 
        borderRadius: 15, 
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    statHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    statLabel: { fontSize: 13, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
    statCount: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },

    // Filtros
    filterScroll: { marginBottom: 25 },
    filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#fff', marginRight: 12, borderWidth: 1, borderColor: '#eee' },
    filterChipActive: { backgroundColor: '#2979FF', borderColor: '#2979FF' },
    filterText: { color: '#666', fontWeight: '500' },
    filterTextActive: { color: '#fff' },

    // Tarjetas
    listContainer: { gap: 20 },
    solicitudCard: { backgroundColor: '#fff', borderRadius: 15, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
    cardImage: { width: 140, height: '100%' },
    cardInfo: { flex: 1, padding: 20 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    cardSubtitle: { color: '#888', marginBottom: 15 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    detailText: { fontSize: 13, color: '#555', marginLeft: 10 },

    // Sección de ayuda inferior
    infoSection: { marginTop: 40, backgroundColor: '#E3F2FD', padding: 25, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#2196F3' },
    infoSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0D47A1', marginBottom: 15 },
    infoRow: { fontSize: 14, color: '#333', marginBottom: 10, lineHeight: 20 }
});

export default misTalleresStyles;