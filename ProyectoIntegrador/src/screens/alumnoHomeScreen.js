import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import homeStyles from '../styles/alumnoHomeStyles';
import Header from '../components/header';

const BREAKPOINT = 768;

const AlumnoHomeScreen = ({ navigation, route }) => { // Mayúscula
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    const { usuario, idUsuario } = route.params || { usuario: 'Usuario', idUsuario: null };

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const isWebLayout = windowWidth > BREAKPOINT;

    const irAEspacios = () => navigation.navigate('Espacios', { usuario, idUsuario });
    const irAMisTalleres = () => navigation.navigate('MisTalleres', { usuario, idUsuario });

    return (
        <View style={homeStyles.container}>
            <Header userName={usuario} role="Alumno" isWeb={isWebLayout} navigation={navigation}/>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={homeStyles.scrollContainer}>
                <View style={homeStyles.welcomeBanner}>
                    <View style={homeStyles.contentWrapper}>
                        <Text style={homeStyles.welcomeTitle}>
                            Hola, {usuario?.split(' ')[0] || 'Alumno'}!
                        </Text>
                        <Text style={homeStyles.welcomeSub}>Bienvenido de nuevo a tu panel.</Text>
                    </View>
                </View>
                <View style={homeStyles.contentWrapper}>
                    <View style={homeStyles.statsContainer}>
                        <StatCard icon="business-outline" color="#00d97e" bg="#e6fcf5" label="Espacios" count="12" onPress={irAEspacios} />
                        <StatCard icon="calendar-outline" color="#3182ce" bg="#ebf8ff" label="Reservas" count="3" onPress={irAMisTalleres} />
                        <StatCard icon="notifications-outline" color="#805ad5" bg="#faf5ff" label="Pendientes" count="1" />
                    </View>
                    <View style={homeStyles.sectionHeader}>
                        <Text style={homeStyles.sectionTitle}>Próximos Talleres</Text>
                        <TouchableOpacity onPress={irAMisTalleres}>
                            <Text style={homeStyles.seeAll}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const StatCard = ({ icon, color, bg, label, count, onPress }) => (
    <TouchableOpacity style={homeStyles.statCard} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
        <View style={[homeStyles.iconBox, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={homeStyles.statNumber}>{count}</Text>
            <Text style={homeStyles.statLabel} numberOfLines={1}>{label}</Text>
        </View>
    </TouchableOpacity>
);

export default AlumnoHomeScreen;