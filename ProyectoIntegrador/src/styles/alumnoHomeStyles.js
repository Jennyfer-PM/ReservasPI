import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isDesktop = Platform.OS === 'web' && width > 768;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    // HEADER
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: isDesktop ? 40 : 20,
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
    // BANNER
    welcomeBanner: {
        backgroundColor: '#00e676',
        padding: isDesktop ? 60 : 30,
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
    // STATS CARDS
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: isDesktop ? 'center' : 'flex-start',
        paddingHorizontal: isDesktop ? 20 : 25,
        gap: 15,
        marginTop: -30,
    },
    statCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: isDesktop ? 300 : '100%',
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
    // SECCIONES
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
    // BOTTOM NAV
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
    }
});