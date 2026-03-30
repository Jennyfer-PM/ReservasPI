import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

const Header = ({ userName, role, isWeb, idUsuario }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const getCurrentRoute = () => {
        const currentRoute = route;
        if (currentRoute?.state?.routes) {
            const currentTab = currentRoute.state.routes[currentRoute.state.index];
            return currentTab?.name || currentRoute.name;
        }
        return currentRoute?.name || '';
    };

    const currentRouteName = getCurrentRoute();

    const isActive = (routeName) => {
        const activeMap = {
            'Inicio': ['AlumnoHome', 'Inicio', 'DocenteHome'],
            'Espacios': ['Espacios', 'Explorar'],
            'Mis Talleres': ['MisTalleres', 'Mis Talleres'],
            'Perfil': ['Perfil', 'PerfilScreen']
        };
        
        const activeRoutes = activeMap[routeName] || [routeName];
        return activeRoutes.includes(currentRouteName);
    };

    const handleNavigation = (target) => {
        console.log("Header - Navegando a:", target, "con idUsuario:", idUsuario, "role:", role);
        
        // Determinar si estamos en modo docente o alumno
        const parentRoute = role === 'Docente' ? 'MainDocente' : 'MainAlumno';
        
        const screenMap = {
            'Inicio': 'Inicio',
            'Espacios': 'Espacios',
            'Mis Talleres': 'Mis Talleres',
            'Perfil': 'Perfil'
        };
        
        const tabName = screenMap[target] || target;
        
        navigation.navigate(parentRoute, {
            screen: tabName,
            params: {
                usuario: userName,
                idUsuario: idUsuario,
                tipoUsuario: role === 'Docente' ? 'docente' : 'alumno'
            }
        });
    };

    const getInitials = () => {
        if (!userName) return "US";
        const parts = userName.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return parts[0].substring(0, 2).toUpperCase();
    };

    const navItems = [
        { name: 'Inicio', route: 'Inicio', icon: 'home-outline' },
        { name: 'Espacios', route: 'Espacios', icon: 'business-outline' },
        { name: 'Mis Talleres', route: 'Mis Talleres', icon: 'calendar-outline' },
        { name: 'Perfil', route: 'Perfil', icon: 'person-outline' }
    ];

    return (
        <View style={styles.headerContainer}>
            {/* LOGO y nombre */}
            <TouchableOpacity 
                style={styles.headerLeft} 
                onPress={() => handleNavigation('Inicio')}
                activeOpacity={0.7}
            >
                <Image 
                    source={require('../../assets/icon PI.png')} 
                    style={styles.logoPI} 
                />
                <View>
                    <Text style={styles.brandName}>SistemaReservas</Text>
                    <Text style={styles.brandSub}>Universidad Politécnica de Querétaro</Text>
                </View>
            </TouchableOpacity>

            {/* NAVEGACIÓN (Solo en Web/Tablet) */}
            {isWeb && (
                <View style={styles.navCenter}>
                    {navItems.map((item) => (
                        <TouchableOpacity 
                            key={item.name}
                            style={styles.navButton} 
                            onPress={() => handleNavigation(item.route)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.navLink, 
                                isActive(item.name) && styles.navLinkActive
                            ]}>
                                {item.name}
                            </Text>
                            {isActive(item.name) && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* NOTIFICACIONES Y AVATAR */}
            <View style={styles.profileSection}>
                <TouchableOpacity style={styles.notifContainer}>
                    <Ionicons name="notifications-outline" size={22} color="#495057" />
                    <View style={styles.notifBadge}>
                        <Text style={styles.notifText}>2</Text>
                    </View>
                </TouchableOpacity>
                
                {isWeb && (
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userName || 'Usuario'}</Text>
                        <Text style={styles.userRole}>{role || 'Alumno'}</Text>
                    </View>
                )}

                <TouchableOpacity 
                    style={[
                        styles.avatar, 
                        isActive('Perfil') && styles.avatarActive
                    ]} 
                    onPress={() => handleNavigation('Perfil')}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.avatarText, 
                        isActive('Perfil') && styles.avatarTextActive
                    ]}>
                        {getInitials()}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: isDesktop ? 80 : 70,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: isDesktop ? 30 : 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        zIndex: 100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            },
        }),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    logoPI: {
        width: 38,
        height: 38,
        resizeMode: 'contain',
    },
    brandName: {
        fontSize: isDesktop ? 17 : 14,
        fontWeight: 'bold',
        color: '#1A1D21',
    },
    brandSub: {
        fontSize: isDesktop ? 11 : 9,
        color: '#6C757D',
        marginTop: -2,
    },
    navCenter: {
        flexDirection: 'row',
        gap: isDesktop ? 35 : 20,
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    navButton: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        position: 'relative',
    },
    navLink: {
        fontSize: isDesktop ? 15 : 13,
        color: '#6C757D',
        fontWeight: '500',
    },
    navLinkActive: {
        color: '#00d97e',
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        backgroundColor: '#00d97e',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isDesktop ? 15 : 10,
        flex: 1,
        justifyContent: 'flex-end',
    },
    userInfo: {
        alignItems: 'flex-end',
        marginRight: 5,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1D21',
    },
    userRole: {
        fontSize: 11,
        color: '#00d97e',
        fontWeight: '500',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    avatarActive: {
        borderColor: '#00d97e',
        borderWidth: 2,
    },
    avatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#495057',
    },
    avatarTextActive: {
        color: '#00d97e',
    },
    notifContainer: {
        padding: 5,
        position: 'relative',
    },
    notifBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    notifText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
});

export default Header;