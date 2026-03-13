import { StyleSheet } from 'react-native';

const COLORS = {
    primary: '#00d97e',
    background: '#f8f9fa', // GRIS MUY CLARO: Aplicado para el fondo general
    textMain: '#1a202c',
    textSub: '#718096',
    border: '#edf2f7',     // Borde más sutil para el fondo gris
    white: '#FFFFFF',      // BLANCO: Para que las tarjetas y el header resalten
    };

    const espaciosStyles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: COLORS.background // Fondo gris claro consistente
    },
    headerWhite: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.white, // Header blanco para contraste
        paddingHorizontal: 25, 
        paddingVertical: 14, 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderBottomWidth: 1, 
        borderBottomColor: COLORS.border 
    },
    headerLeft: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    headerCenter: { 
        flex: 2, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 25 
    },
    headerRight: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
    logoPI: { width: 34, height: 34, marginRight: 10 },
    brandName: { color: '#003366', fontWeight: 'bold', fontSize: 17 },
    universityText: { color: '#999', fontSize: 11, marginTop: -3 },
    navLink: { fontWeight: '600', color: '#718096', fontSize: 14 },
    navLinkActive: { color: COLORS.primary },
    notifIcon: { position: 'relative', marginRight: 15 },
    badgeNotif: { position: 'absolute', top: -4, right: -4, backgroundColor: '#FF4D4D', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
    headerAvatarText: { color: COLORS.white, fontSize: 13, fontWeight: 'bold' },

    contentScroll: { flex: 1 },
    centeredContentWeb: { maxWidth: 1100, alignSelf: 'center', width: '100%', paddingVertical: 40 },
    mobilePadding: { padding: 20 },

    mainTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.textMain },
    subTitle: { fontSize: 16, color: COLORS.textSub, marginTop: 8, marginBottom: 30 },

    searchRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    searchBar: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: COLORS.white, // Blanco para resaltar sobre el gris
        borderRadius: 12, 
        paddingHorizontal: 15, 
        height: 50, 
        borderWidth: 1, 
        borderColor: COLORS.border 
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
    filterButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        backgroundColor: COLORS.white,
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: COLORS.border, 
        gap: 8 
    },
    filterButtonText: { fontWeight: '600' },

    categoriesScroll: { 
        marginBottom: 25 , 
    },
    categoryChip: { 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderRadius: 25, 
        backgroundColor: COLORS.white, 
        borderWidth: 1, 
        borderColor: COLORS.border, 
        marginRight: 10 , 
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    categoryChipActive: { 
        backgroundColor: COLORS.primary, 
        borderColor: COLORS.primary 
    },
    categoryText: { 
        color: COLORS.textSub, 
        fontWeight: '500' 
    },
    categoryTextActive: { 
        color: COLORS.white 
    },

    resultsCount: { fontSize: 14, color: COLORS.textSub, marginBottom: 20 },

    gridEspacios: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
    card: { 
        width: '48%', 
        backgroundColor: COLORS.white, // Blanco sólido
        borderRadius: 20, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: COLORS.border,
        // Sombra sutil para dar profundidad sobre el fondo gris
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3 
    },
    imageContainer: { height: 180, position: 'relative' },
    cardImage: { width: '100%', height: '100%' },
    tagBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    tagText: { fontSize: 11, fontWeight: 'bold', color: COLORS.textSub },

    cardContent: { padding: 20 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
    cardLocation: { fontSize: 14, color: COLORS.textSub, marginVertical: 6 },
    cardDetails: { flexDirection: 'row', gap: 15, marginBottom: 15 },
    detailItem: { fontSize: 13, color: COLORS.textSub },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
    statusBadge: { backgroundColor: '#e6fffa', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
    statusText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
    btnSolicitar: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
    btnText: { color: COLORS.white, fontWeight: 'bold' },

    scrollContainer: {
        paddingBottom: 10,
    },

    scrollIndicatorContainer: {
        height: 6, 
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        marginTop: 4,
    }

});

export default espaciosStyles;