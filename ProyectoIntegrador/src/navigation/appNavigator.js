import React from 'react';
import { useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// IMPORTACIONES
import loginScreen from '../screens/loginScreen';
import alumnoHomeScreen from '../screens/alumnoHomeScreen';
import espaciosScreen from '../screens/espaciosScreen'; 
import misTalleresScreen from '../screens/misTalleresScreen';
import perfilScreen from '../screens/perfilScreen';
// ESTA ES LA LÍNEA QUE FALTA O ESTÁ MAL:
import editarPerfilScreen from '../screens/editarPerfilScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AlumnoTabs() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#00d97e',
                tabBarInactiveTintColor: '#adb5bd',
                tabBarStyle: { 
                    height: 60, 
                    paddingBottom: 8,
                    display: isMobile ? 'flex' : 'none' 
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Espacios') iconName = focused ? 'business' : 'business-outline';
                    else if (route.name === 'Mis Talleres') iconName = focused ? 'calendar' : 'calendar-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={alumnoHomeScreen} />
            <Tab.Screen name="Espacios" component={espaciosScreen} /> 
            <Tab.Screen name="Mis Talleres" component={misTalleresScreen} />
            <Tab.Screen name="Perfil" component={perfilScreen} />
        </Tab.Navigator>
    );
}

const appNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={loginScreen} />
                <Stack.Screen name="Main" component={AlumnoTabs} />
                {/* Aquí es donde usas la variable editarPerfilScreen */}
                <Stack.Screen name="EditarPerfil" component={editarPerfilScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default appNavigator;