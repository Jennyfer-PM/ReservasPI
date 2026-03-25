import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
    },
    infoSection: {
        width: '100%',
        marginBottom: 25,
    },
    badge: {
        backgroundColor: '#e0f2fe',
        color: '#0ea5e9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 10,
    },
    cardForm: {
        backgroundColor: '#ffffff',
        width: '100%',
        borderRadius: 20,
        padding: 20,
        // Sombra para iOS y Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1e293b',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
    },
    fechaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    fechaBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    fechaBtnActive: {
        backgroundColor: '#1e293b',
        borderColor: '#1e293b',
    },
    fechaText: {
        color: '#64748b',
        fontSize: 12,
    },
    fechaTextActive: {
        color: '#ffffff',
        fontSize: 12,
    },
    btnConfirmar: {
        backgroundColor: '#00d97e',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 25,
    },
    btnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});