import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

const misTalleresStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    contentScroll: {
        flex: 1,
    },
    // Contenedor centrado para evitar que se estire en tablets
    centeredContentWeb: {
        width: '100%',
        maxWidth: 900, // Limita el ancho en pantallas grandes
        alignSelf: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    mobilePadding: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 10,
    },
    // Estilos para la lista de filtros
    filterScroll: {
        marginVertical: 15,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 10,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    // Estilos para las tarjetas de solicitudes
    listContainer: {
        marginTop: 10,
        paddingBottom: 40,
    },
    solicitudCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
        gap: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    detailText: {
        fontSize: 12,
        color: '#64748b',
    }
});

export default misTalleresStyles;