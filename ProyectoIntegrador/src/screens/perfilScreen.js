import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import perfilStyles from '../styles/perfilStyles';
import homeStyles from '../styles/alumnoHomeStyles'; // Import para Header consistente

const BREAKPOINT = 768;

const perfilScreen = ({ navigation }) => {
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const isWebLayout = windowWidth > BREAKPOINT;

    return (
        <View style={perfilStyles.mainContainer}>
            {/* HEADER UNIFICADO */}
            <View style={homeStyles.header}>
                <View style={homeStyles.headerLeft}>
                    <Image source={require('../../assets/icon PI.png')} style={homeStyles.logoPI} />
                    <View>
                        <Text style={homeStyles.brandName}>SistemaReservas</Text>
                        <Text style={homeStyles.brandSub}>Universidad</Text>
                    </View>
                </View>

                {isWebLayout && (
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Inicio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Espacios')}> 
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Espacios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Mis Talleres')}>
                            <Text style={{ fontWeight: '600', color: '#495057' }}>Mis Talleres</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                            <Text style={{ fontWeight: '600', color: '#00d97e' }}>Perfil</Text>
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

            <ScrollView style={perfilStyles.contentScroll} contentContainerStyle={perfilStyles.scrollInner}>
                <View style={isWebLayout ? perfilStyles.centeredContentWeb : null}>
                    <View style={perfilStyles.userRowSection}>
                        <View style={perfilStyles.avatarWrapper}>
                            <View style={perfilStyles.avatarMain}><Text style={perfilStyles.avatarMainText}>AM</Text></View>
                            <TouchableOpacity style={perfilStyles.cameraBtn}><Ionicons name="camera" size={12} color="#FFF" /></TouchableOpacity>
                        </View>
                        <View style={perfilStyles.userMainInfo}>
                            <Text style={perfilStyles.textUserName}>Ana Martínez</Text>
                            <Text style={perfilStyles.textUserRole}>Alumno</Text>
                            <Text style={perfilStyles.textUserFaculty}>Facultad de Ingeniería</Text>
                            <TouchableOpacity style={perfilStyles.editProfileBtn}>
                                <Text style={perfilStyles.editProfileText}>Editar perfil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={perfilStyles.infoGrid}>
                        <InfoSmallCard icon="calendar-outline" label="Fecha de registro" value="12 Oct 2023" />
                        <InfoSmallCard icon="id-card-outline" label="Matrícula" value="124049915" />
                        <InfoSmallCard icon="school-outline" label="Carrera" value="TIID" />
                        <InfoSmallCard icon="layers-outline" label="Cuatrimestre" value="5to" />
                    </View>

                    <View style={perfilStyles.statsGrid}>
                        <View style={[perfilStyles.statCard, perfilStyles.statBlue]}>
                            <Ionicons name="calendar" size={28} color="#FFF" />
                            <Text style={perfilStyles.statValue}>28</Text>
                            <Text style={perfilStyles.statDesc}>Solicitudes totales</Text>
                        </View>
                        <View style={[perfilStyles.statCard, perfilStyles.statGreen]}>
                            <Ionicons name="checkmark-circle" size={28} color="#FFF" />
                            <Text style={perfilStyles.statValue}>24</Text>
                            <Text style={perfilStyles.statDesc}>Solicitudes aprobadas</Text>
                        </View>
                    </View>

                    <Text style={perfilStyles.sectionHeading}>CONFIGURACIÓN DE CUENTA</Text>
                    <View style={perfilStyles.whiteCard}>
                        <MenuActionRow icon="lock-closed-outline" label="Contraseña" subLabel="Cambiar mi contraseña" />
                        <MenuActionRow icon="trash-outline" label="Privacidad" subLabel="Eliminar mi cuenta" isDestructive />
                    </View>

                    <TouchableOpacity style={perfilStyles.btnExit}>
                        <Ionicons name="log-out-outline" size={20} color="#FF4D4D" />
                        <Text style={perfilStyles.btnExitText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const InfoSmallCard = ({ icon, label, value }) => (
    <View style={perfilStyles.smallCard}>
        <Ionicons name={icon} size={20} color="#00d97e" />
        <Text style={perfilStyles.smallLabel}>{label}</Text>
        <Text style={perfilStyles.smallValue}>{value}</Text>
    </View>
);

const MenuActionRow = ({ icon, label, subLabel, isDestructive }) => (
    <TouchableOpacity style={perfilStyles.actionRow}>
        <View style={perfilStyles.iconContainer}><Ionicons name={icon} size={20} color={isDestructive ? "#FF4D4D" : "#666"} /></View>
        <View style={{flex:1}}>
            <Text style={perfilStyles.actionLabel}>{label}</Text>
            <Text style={[perfilStyles.actionSub, isDestructive && {color: '#FF4D4D'}]}>{subLabel}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
);

export default perfilScreen;