import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
// Definimos el breakpoint estándar de 768px
const isWeb = Platform.OS === 'web' && width > 768;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // HEADER
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: isWeb ? 40 : 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#FFF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoPI: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    brandName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
    },
    brandSub: {
        fontSize: 12,
        color: '#888',
    },
    navContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    navLink: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    navLinkActive: {
        color: '#00e676',
        fontWeight: 'bold',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userInfo: {
        alignItems: 'flex-end',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    userRole: {
        fontSize: 11,
        backgroundColor: '#e8f5e9',
        color: '#4caf50',
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: '#00e676',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    notifBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#ff4d4f',
        borderRadius: 10,
        width: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    notifText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    // BANNER VERDE
    welcomeBanner: {
        backgroundColor: '#00e676',
        padding: isWeb ? 60 : 30,
        width: '100%',
    },
    contentWrapper: {
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    welcomeSub: {
        fontSize: 16,
        color: '#FFF',
        marginTop: 10,
        opacity: 0.9,
    },
    // CARDS DE ESTADO (MODIFICADO)
    statsContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap', // Permite que las tarjetas bajen en móvil
        justifyContent: isWeb ? 'center' : 'flex-start',
        paddingHorizontal: isWeb ? 20 : 25,
        gap: 15,
        marginTop: -30,
    },
    statCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        // Si es web usa ancho fijo, si es móvil usa el 100% para que se apilen
        width: isWeb ? 300 : '100%',
        ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
        android: { elevation: 5 },
        web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }
        }),
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 13,
        color: '#777',
    },
    // SECCIÓN PRÓXIMOS TALLERES
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAll: {
        color: '#00e676',
        fontWeight: '600',
    },
    emptyContainer: {
        marginTop: 15,
        marginBottom: 100,
    },
    emptyText: {
        color: '#adb5bd',
        fontStyle: 'italic',
        fontSize: 13,
    },
    // NAVIGATION BAR (MÓVIL)
    bottomNav: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        paddingTop: 10,
        backgroundColor: '#FFF',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        flex: 1,
    },
    navItemActive: {
        backgroundColor: '#f0fff4',
        borderRadius: 12,
        marginHorizontal: 5,
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: '#adb5bd',
    },
    navTextActive: {
        color: '#00d97e',
        fontWeight: 'bold',
    },
    searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
    alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F1F3F5',
        borderRadius: 12,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 45,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
    },
    filterBtn: {
        backgroundColor: '#00e676',
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitleExplore: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 25,
        marginTop: 25,
        marginBottom: 15,
    },
    tallerCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        margin: 10,
        flex: 1,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEE',
        ...Platform.select({
        web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' },
        android: { elevation: 3 }
        }),
    },
    tallerImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#EEE',
    },
    tallerInfo: {
        padding: 15,
    },
    tallerNombre: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    tallerDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 5,
    },
    tallerDetailText: {
        fontSize: 12,
        color: '#777',
    },
    btnInscribir: {
        backgroundColor: '#e8f5e9',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    btnInscribirText: {
        color: '#4caf50',
        fontWeight: 'bold',
        fontSize: 12,
    },
});