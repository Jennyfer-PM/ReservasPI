import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, Dimensions, 
  StyleSheet, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/header';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const AlumnoHomeScreen = ({ navigation, route }) => {
  const [windowWidth, setWindowWidth] = useState(width);
  const { usuario, idUsuario } = route.params || { usuario: 'Usuario', idUsuario: null };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isWebLayout = windowWidth > 768;

  const stats = [
    { 
      icon: 'business-outline', 
      label: 'Espacios', 
      count: '12', 
      bgColor: '#E8F5E9', 
      iconColor: '#2E7D32',
      onPress: () => navigation.navigate('Explorar', { usuario, idUsuario })
    },
    { 
      icon: 'calendar-outline', 
      label: 'Reservas', 
      count: '3', 
      bgColor: '#E3F2FD', 
      iconColor: '#1565C0',
      onPress: () => navigation.navigate('Mis Talleres', { usuario, idUsuario })
    },
    { 
      icon: 'time-outline', 
      label: 'Pendientes', 
      count: '1', 
      bgColor: '#FFF3E0', 
      iconColor: '#EF6C00',
      onPress: () => navigation.navigate('Mis Talleres', { usuario, idUsuario })
    }
  ];

  const upcomingActivities = [
    { id: 1, title: 'Taller de Programación', date: '15 Abr 2026', time: '10:00 AM', location: 'Sala de Cómputo 1' },
    { id: 2, title: 'Clase de Redes', date: '16 Abr 2026', time: '12:00 PM', location: 'Aula 101' },
    { id: 3, title: 'Conferencia IA', date: '18 Abr 2026', time: '09:00 AM', location: 'Auditorio 1' },
  ];

  return (
    <View style={styles.container}>
      <Header userName={usuario} role="Alumno" isWeb={isWebLayout} navigation={navigation} idUsuario={idUsuario} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Banner de bienvenida */}
        <View style={styles.welcomeBanner}>
          <View style={styles.contentWrapper}>
            <Text style={styles.welcomeTitle}>
              Hola, {usuario?.split(' ')[0] || 'Alumno'}!
            </Text>
            <Text style={styles.welcomeSub}>
              Bienvenido de nuevo a tu panel de control
            </Text>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          {/* Tarjetas de estadísticas */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.statCard}
                onPress={stat.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBox, { backgroundColor: stat.bgColor }]}>
                  <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statNumber}>{stat.count}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sección de Próximas Actividades */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Actividades</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Mis Talleres', { usuario, idUsuario })}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {upcomingActivities.map((activity) => (
            <TouchableOpacity key={activity.id} style={styles.activityCard}>
              <View style={styles.activityDate}>
                <Text style={styles.dateDay}>{activity.date.split(' ')[0]}</Text>
                <Text style={styles.dateMonth}>{activity.date.split(' ')[1]}</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <View style={styles.activityDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={14} color="#64748B" />
                    <Text style={styles.detailText}>{activity.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.detailText}>{activity.location}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))}

          {/* Espacios Recomendados */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Espacios Recomendados</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explorar', { usuario, idUsuario })}>
              <Text style={styles.seeAll}>Explorar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {['Sala de Cómputo', 'Auditorio', 'Laboratorio', 'Aula Magna'].map((space, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.spaceCard}
                onPress={() => navigation.navigate('Explorar', { usuario, idUsuario })}
              >
                <View style={styles.spaceImage}>
                  <Ionicons name="business-outline" size={32} color="#00d97e" />
                </View>
                <Text style={styles.spaceName}>{space}</Text>
                <Text style={styles.spaceCapacity}>Capacidad: {20 + index * 10} pers.</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isDesktop ? 32 : 20,
  },
  welcomeBanner: {
    backgroundColor: '#00d97e',
    paddingVertical: isDesktop ? 48 : 32,
    width: '100%',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: isDesktop ? 32 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeSub: {
    fontSize: isDesktop ? 16 : 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
      flex: 1,
      minWidth: isDesktop ? 180 : 100, 
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      }),
      borderWidth: 1,
      borderColor: '#F1F5F9',
    },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    alignItems: 'center',
    width: '100%',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAll: {
    fontSize: 14,
    color: '#00d97e',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  activityDate: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d97e',
  },
  dateMonth: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  activityDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
  },
  horizontalScroll: {
    marginBottom: 32,
  },
  spaceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: 140,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  spaceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  spaceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  spaceCapacity: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default AlumnoHomeScreen;