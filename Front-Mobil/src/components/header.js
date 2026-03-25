import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = ({ userName, role, isWeb }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const isActive = (routeName) => {
        if (!route) return false;
        return route.name === routeName;
    };

    const handleNavigation = (target) => {
        const realTarget = target === 'AlumnoHome' ? 'Inicio' : target;
        const isTabScreen = ['Inicio', 'Espacios', 'MisTalleres', 'Perfil'].includes(realTarget);

        if (isTabScreen) {
            navigation.navigate('Main', { screen: realTarget });
        } else {
            navigation.navigate(realTarget);
        }
    };

    return (
        <View style={styles.headerContainer}>
            {/* 1. LOGO */}
            <TouchableOpacity 
                style={styles.headerLeft} 
                onPress={() => handleNavigation('AlumnoHome')}
            >
                <Image 
                    source={require('../../assets/icon PI.png')} 
                    style={styles.logoPI} 
                />
                <View>
                    <Text style={styles.brandName}>SistemaReservas</Text>
                    <Text style={styles.brandSub}>Universidad</Text>
                </View>
            </TouchableOpacity>

            {/* 2. NAVEGACIÓN (Solo Web) */}
            {isWeb && (
                <View style={styles.navCenter}>
                    {/* Inicio */}
                    <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('AlumnoHome')}>
                        <Text style={[styles.navLink, isActive('AlumnoHome') && styles.navLinkActive]}>
                            Inicio
                        </Text>
                        {isActive('Inicio') && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                    
                    {/* Espacios */}
                    <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('Espacios')}>
                        <Text style={[styles.navLink, isActive('Espacios') && styles.navLinkActive]}>
                            Espacios
                        </Text>
                        {isActive('Espacios') && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                    
                    {/* Mis Talleres */}
                    <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('MisTalleres')}>
                        <Text style={[styles.navLink, isActive('MisTalleres') && styles.navLinkActive]}>
                            Mis Talleres
                        </Text>
                        {isActive('MisTalleres') && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                    
                    {/* Perfil */}
                    <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('Perfil')}>
                        <Text style={[styles.navLink, isActive('Perfil') && styles.navLinkActive]}>
                            Perfil
                        </Text>
                        {isActive('Perfil') && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                </View>
            )}

            {/* 3. NOTIFICACIONES Y AVATAR */}
            <View style={styles.profileSection}>
                <View style={styles.notifContainer}>
                    <Ionicons name="notifications-outline" size={22} color="#495057" />
                    <View style={styles.notifBadge}>
                        <Text style={styles.notifText}>2</Text>
                    </View>
                </View>
                
                {isWeb && (
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.userRole}>{role}</Text>
                    </View>
                )}

                <TouchableOpacity 
                    style={[
                        styles.avatar, 
                        isActive('Perfil') && { borderColor: '#00d97e', borderWidth: 2 }
                    ]} 
                    onPress={() => handleNavigation('Perfil')}
                >
                    <Text style={[styles.avatarText, isActive('Perfil') && { color: '#00d97e' }]}>
                        {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'AM'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 80,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
        zIndex: 100,
        elevation: 4,
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
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1A1D21',
    },
    brandSub: {
        fontSize: 11,
        color: '#6C757D',
        marginTop: -2,
    },
    navCenter: {
        flexDirection: 'row',
        gap: 35,
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
        fontSize: 15,
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
        height: 4,
        backgroundColor: '#00d97e',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
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
    avatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#495057',
    },
    notifContainer: {
        padding: 5,
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
        paddingHorizontal: 2,
    },
    notifText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
});

export default Header;