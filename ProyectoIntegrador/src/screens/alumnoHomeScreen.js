import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import homeStyles from '../styles/alumnoHomeStyles';

const BREAKPOINT = 768;

const alumnoHomeScreen = ({ navigation }) => {
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const isWebLayout = windowWidth > BREAKPOINT;

    return (
        <View style={homeStyles.container}>
            <View style={homeStyles.header}>
                <View style={homeStyles.headerLeft}>
                    <Image source={require('../../assets/icon PI.png')} style={homeStyles.logoPI} />
                    <View>
                        <Text style={homeStyles.brandName}>SistemaReservas</Text>
                        <Text style={homeStyles.brandSub}>Universidad</Text>
                    </View>
                </View>

                {/* MENÚ SUPERIOR: Se activa solo en pantallas anchas (PC) */}
                {isWebLayout && (
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
                            <Text style={{ fontWeight: '600', color: '#00d97e' }}>Inicio</Text>
                        </TouchableOpacity>
                        
                        {/* CAMBIO AQUÍ: De 'Explorar' a 'Espacios' */}
                        <TouchableOpacity onPress={() => navigation.navigate('Espacios')}> 
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Espacios</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Mis Talleres')}>
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Mis Talleres</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Perfil</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={homeStyles.profileSection}>
                    <View style={{ position: 'relative' }}>
                        <Ionicons name="notifications-outline" size={22} color="#495057" />
                        <View style={homeStyles.notifBadge}>
                            <Text style={{color: '#FFF', fontSize: 8, fontWeight: 'bold'}}>2</Text>
                        </View>
                    </View>
                    {isWebLayout && (
                        <View style={homeStyles.userInfo}>
                            <Text style={homeStyles.userName}>Ana Martínez</Text>
                            <Text style={homeStyles.userRole}>Alumno</Text>
                        </View>
                    )}
                    <View style={homeStyles.avatar}><Text style={homeStyles.avatarText}>AM</Text></View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={homeStyles.welcomeBanner}>
                    <View style={homeStyles.contentWrapper}>
                        <Text style={homeStyles.welcomeTitle}>Bienvenido, Ana</Text>
                        <Text style={homeStyles.welcomeSub}>Explora y regístrate en los talleres disponibles</Text>
                    </View>
                </View>

                <View style={homeStyles.contentWrapper}>
                    <View style={homeStyles.statsContainer}>
                        <StatCard icon="search" color="#00d97e" bg="#f0fff4" label="Talleres disponibles" count="0" />
                        <StatCard icon="book-outline" color="#3182ce" bg="#ebf8ff" label="Talleres inscritos" count="3" />
                        <StatCard icon="calendar-outline" color="#805ad5" bg="#faf5ff" label="Pendiente aprobación" count="1" />
                    </View>

                    <View style={homeStyles.sectionHeader}>
                        <Text style={homeStyles.sectionTitle}>Próximos talleres</Text>
                        <TouchableOpacity><Text style={homeStyles.seeAll}>Ver todos</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const StatCard = ({ icon, color, bg, label, count }) => (
    <View style={homeStyles.statCard}>
        <View style={[homeStyles.iconBox, { backgroundColor: bg }]}><Ionicons name={icon} size={20} color={color} /></View>
        <View><Text style={homeStyles.statNumber}>{count}</Text><Text style={homeStyles.statLabel}>{label}</Text></View>
    </View>
);

export default alumnoHomeScreen;