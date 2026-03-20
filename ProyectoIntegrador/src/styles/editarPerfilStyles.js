import { StyleSheet } from 'react-native';

const editarPerfilStyles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
    headerWhite: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    headerLeft: { width: 40 },
    headerRight: { width: 40 },
    scrollInner: { padding: 20 },
    centeredContent: { maxWidth: 600, alignSelf: 'center', width: '100%' },
    
    // Avatar
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatarWrapper: { position: 'relative', marginBottom: 10 },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2D7FF9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    changePhotoText: { color: '#2D7FF9', fontWeight: '600' },

    // Formulario
    sectionLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
    formCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, elevation: 1 },
    inputGroup: { marginBottom: 15 },
    inputLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
    textInput: { 
        backgroundColor: '#F8F9FA', 
        padding: 12, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#EEE',
        color: '#333'
    },

    // Botones
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
    btnCancel: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#DDD' },
    btnCancelText: { color: '#666', fontWeight: 'bold' },
    btnSave: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: '#00d97e' },
    btnSaveText: { color: '#FFF', fontWeight: 'bold' },
});

export default editarPerfilStyles;