import { StyleSheet, Dimensions, Platform } from 'react-native';

const COLORS = {
    primary: '#00d97e',
    background: '#fcfcfc',
    textMain: '#1a202c',
    textSub: '#64748b',
    border: '#e2e8f0',
    white: '#FFFFFF',
    danger: '#991b1b',
    dangerBg: '#fee2e2',
    successBg: '#dcfce7',
    successText: '#166534'
};

const espaciosStyles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: COLORS.background 
    },
    contentScroll: { flex: 1 },
    centeredContent: { 
        maxWidth: 1200, 
        alignSelf: 'center', 
        width: '100%', 
        paddingVertical: 24,
        paddingHorizontal: 24 
    },
    explorarTitle: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: COLORS.textMain,
    },
    explorarSubtitle: { 
        fontSize: 16, 
        color: COLORS.textSub, 
        marginTop: 4, 
        marginBottom: 24 
    },
    searchBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: COLORS.white, 
        borderRadius: 12, 
        paddingHorizontal: 16, 
        height: 50, 
        borderWidth: 1, 
        borderColor: COLORS.border 
    },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 14, color: COLORS.textMain },
    filterToggle: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderLeftWidth: 1, 
        borderLeftColor: COLORS.border, 
        paddingLeft: 12 
    },
    filterToggleText: { marginLeft: 8, fontWeight: '500', color: '#1f2937' },
    catScroll: { marginVertical: 20, flexGrow: 0 },
    catBadge: { 
        paddingHorizontal: 20, 
        paddingVertical: 8, 
        borderRadius: 20, 
        backgroundColor: COLORS.white, 
        marginRight: 10, 
        borderWidth: 1, 
        borderColor: COLORS.border 
    },
    catBadgeActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    catText: { color: COLORS.textSub, fontWeight: '600' },
    catTextActive: { color: COLORS.white },
    countText: { fontSize: 14, color: COLORS.textSub, marginBottom: 16 },
    gridEspacios: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'flex-start',
        gap: 20 
    },
    card: { 
        backgroundColor: COLORS.white, 
        borderRadius: 16, 
        width: Dimensions.get('window').width > 768 ? '31.5%' : '100%', 
        marginBottom: 10, 
        overflow: 'hidden', 
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }
        })
    },
    imageContainer: { height: 180, position: 'relative', backgroundColor: '#f1f5f9' },
    cardImage: { width: '100%', height: '100%' },
    typeBadge: { 
        position: 'absolute', 
        top: 12, 
        right: 12, 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 12 
    },
    typeText: { fontSize: 11, fontWeight: 'bold', color: COLORS.textMain },
    cardBody: { padding: 16 },
    cardName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    cardLocation: { fontSize: 13, color: COLORS.textSub, marginTop: 4 },
    statsRow: { flexDirection: 'row', marginTop: 12, gap: 12 },
    stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statText: { fontSize: 12, color: COLORS.textSub },
    cardFooter: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 20 
    },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    btnSolicitar: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    btnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 }
});

export default espaciosStyles;