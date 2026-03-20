import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isDesktop = Platform.OS === 'web' && width > 768;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    welcomeBanner: {
        backgroundColor: '#00d97e',
        paddingVertical: isDesktop ? 60 : 35,
        width: '100%',
    },
    contentWrapper: {
        maxWidth: 1000,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 25, // Margen para móvil, en PC se centra por el maxWidth
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    welcomeSub: {
        fontSize: 16,
        color: '#FFF',
        marginTop: 5,
        opacity: 0.9,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: -30,
        gap: 15,
    },
    statCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,    // Se estiran para llenar el espacio
        flexShrink: 0, 
        flexBasis: 280, // Intentan medir esto, si no caben, bajan de línea
        minHeight: 90,
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
            },
            android: {
                elevation: 4,
            },
        }),
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1d21',
    },
    statLabel: {
        fontSize: 13,
        color: '#6c757d',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1d21',
    },
    seeAll: {
        color: '#00d97e',
        fontWeight: '600',
        fontSize: 15,
    },
});