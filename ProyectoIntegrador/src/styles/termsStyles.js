import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    height: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#00e676',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginTop: 8,
  },
  contactBox: {
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#C6F6D5',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    marginBottom: 40,
  }
});