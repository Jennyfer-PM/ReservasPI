import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/loginScreen';
import AlumnoHomeScreen from '../screens/alumnoHomeScreen';
import EspaciosScreenComponent from '../screens/espaciosScreen';
import DetalleEspacioScreen from '../screens/detalleEspacioScreen';
import PerfilScreen from '../screens/perfilScreen';
import FormularioReserva from '../screens/formularioReservaScreen';
import MisTalleresScreen from '../screens/misTalleresScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color, focused }) => {
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 38,
            minWidth: 70,
        }}>
            {focused && (
                <View style={{
                    position: 'absolute',
                    backgroundColor: '#ebfdf5',
                    borderRadius: 20,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                }} />
            )}
            <Ionicons name={name} size={22} color={color} />
        </View>
    );
};

function AlumnoTabs({ route }) {
    const { width } = useWindowDimensions();
    const { usuario, idUsuario } = route.params || {};

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: width > 768 ? { display: 'none' } : { 
                    height: 70, 
                    paddingBottom: 12, 
                    paddingTop: 8,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f1f5f9',
                }, 
                tabBarActiveTintColor: '#00c872', 
                tabBarInactiveTintColor: '#94a3b8',
                tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
            }}
        >
            <Tab.Screen 
                name="Inicio" 
                component={AlumnoHomeScreen} 
                initialParams={{ usuario, idUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="home-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Explorar" 
                component={EspaciosScreenComponent} 
                initialParams={{ usuario, idUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="search-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Mis Talleres" 
                component={MisTalleresScreen} 
                initialParams={{ usuario, idUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="calendar-outline" color={color} focused={focused} />
                    )
                }}
            />

            <Tab.Screen 
                name="Perfil" 
                component={PerfilScreen} 
                initialParams={{ usuario, idUsuario }}
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="person-outline" color={color} focused={focused} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={AlumnoTabs} />
                <Stack.Screen name="DetalleEspacio" component={DetalleEspacioScreen} />
                <Stack.Screen name="FormularioReserva" component={FormularioReserva} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;