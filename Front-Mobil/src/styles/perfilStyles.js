import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

const perfilStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollInner: {
        flexGrow: 1,
    },
    centeredContentWeb: {
        width: '100%',
        maxWidth: 800,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    mobilePadding: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    /* DATOS PERSONALES */
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        // Sombras
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginBottom: 20,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        // Efecto visual de círculo sólido
    },
    avatarText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    userNameLarge: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    userPuesto: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 2,
    },
    userFacultad: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 12,
    },
    editLink: {
        marginBottom: 24,
    },
    editLinkText: {
        color: '#2563eb',
        fontWeight: '600',
        fontSize: 15,
    },
    detailsContainer: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1e293b',
    },

    /* KPI SQUARES */
    kpiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 20,
    },
    kpiCard: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        minHeight: 140,
        justifyContent: 'center',
    },
    kpiCount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginVertical: 4,
    },
    kpiLabel: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        fontWeight: '500',
    },

    /* MENU ITEMS */
    menuGroup: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    },

    /* AYUDA */
    helpCard: {
        backgroundColor: '#eff6ff', 
        borderRadius: 24,
        padding: 24,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    helpSubtitle: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 20,
    },
    helpButtonPrimary: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2563eb',
        marginBottom: 10,
    },
    helpButtonTextPrimary: {
        color: '#2563eb',
        fontWeight: 'bold',
        fontSize: 15,
    },
    helpButtonSecondary: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    helpButtonTextSecondary: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    }
});

export default perfilStyles;