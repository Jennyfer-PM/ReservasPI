import React from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/loginScreen';
import AlumnoHomeScreen from '../screens/alumnoHomeScreen';
import DocenteHomeScreen from '../screens/docenteHomeScreen';
import EspaciosScreen from '../screens/espaciosScreen';
import DetalleEspacioScreen from '../screens/detalleEspacioScreen';
import PerfilScreen from '../screens/perfilScreen';
import FormularioReserva from '../screens/formularioReservaScreen';
import MisTalleresScreen from '../screens/misTalleresScreen';
import CrearTallerScreen from '../screens/crearTallerScreen';
import DetalleTallerScreen from '../screens/detalleTallerScreen';
import EditarTallerScreen from '../screens/editarTallerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

let globalUserParams = {};

const TabIcon = ({ name, color, focused }) => {
    return (
        <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
            <Ionicons name={name} size={22} color={color} />
        </View>
    );
};

function AlumnoTabs({ route }) {
    const { width } = useWindowDimensions();
    const params = route.params || {};
    const usuario = params.usuario;
    const idUsuario = params.idUsuario;
    const tipoUsuario = params.tipoUsuario;
    
    if (idUsuario) {
        globalUserParams = { usuario, idUsuario, tipoUsuario };
    }
    
    const tabBarStyle = width > 768 
        ? { display: 'none' } 
        : styles.tabBarMobile;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: tabBarStyle,
                tabBarActiveTintColor: '#00c872',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarLabelStyle: styles.tabBarLabel
            }}
        >
            <Tab.Screen 
                name="Inicio" 
                component={AlumnoHomeScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="home-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Explorar" 
                component={EspaciosScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="search-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Mis Talleres" 
                component={MisTalleresScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="calendar-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Perfil" 
                component={PerfilScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="person-outline" color={color} focused={focused} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

function DocenteTabs({ route }) {
    const { width } = useWindowDimensions();
    const params = route.params || {};
    const usuario = params.usuario;
    const idUsuario = params.idUsuario;
    const tipoUsuario = params.tipoUsuario;
    
    if (idUsuario) {
        globalUserParams = { usuario, idUsuario, tipoUsuario };
    }
    
    const tabBarStyle = width > 768 
        ? { display: 'none' } 
        : styles.tabBarMobile;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: tabBarStyle,
                tabBarActiveTintColor: '#00c872',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarLabelStyle: styles.tabBarLabel
            }}
        >
            <Tab.Screen 
                name="Inicio" 
                component={DocenteHomeScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="home-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Mis Talleres" 
                component={MisTalleresScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="calendar-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Espacios" 
                component={EspaciosScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="business-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Perfil" 
                component={PerfilScreen} 
                initialParams={{ usuario, idUsuario, tipoUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="person-outline" color={color} focused={focused} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export const getUserParams = () => {
    return globalUserParams;
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainAlumno" component={AlumnoTabs} />
                <Stack.Screen name="MainDocente" component={DocenteTabs} />
                <Stack.Screen name="DetalleEspacio" component={DetalleEspacioScreen} />
                <Stack.Screen name="FormularioReserva" component={FormularioReserva} />
                <Stack.Screen name="CrearTaller" component={CrearTallerScreen} />
                <Stack.Screen name="DetalleTaller" component={DetalleTallerScreen} />
                <Stack.Screen name="EditarTaller" component={EditarTallerScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        minWidth: 70
    },
    tabIconFocused: {
        position: 'relative'
    },
    tabBarMobile: {
        height: 70,
        paddingBottom: 12,
        paddingTop: 8,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9'
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600'
    }
});

export default AppNavigator;