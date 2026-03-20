import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';
import styles from '../styles/espaciosStyles'; 

const CATEGORIAS = ['Todos', 'Laboratorios', 'Auditorios', 'Salas', 'Talleres', 'Biblioteca', 'Salas de Cómputo', 'Salones'];

const IMAGENES_DEFAULT = {
    'Laboratorios': require('../../assets/laboratorio.jpg'),
    'Salas de Cómputo': require('../../assets/salacomputo.jpg'),
    'Auditorios': require('../../assets/auditorio.jpg'),
    'Biblioteca': require('../../assets/biblioteca.jpg'),
    'Salas': require('../../assets/sala.jpg'),
    'Talleres': require('../../assets/taller.jpg'),
    'Salones': require('../../assets/salon.jpg'),
    'Default': require('../../assets/laboratorio.jpg'), 
};

const EspaciosScreen = ({ navigation, route }) => {
    const { usuario } = route.params || { usuario: 'Axel Romo' };
    const [espacios, setEspacios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    const [showFilters, setShowFilters] = useState(false);
    const [minCap, setMinCap] = useState('0');
    const [maxCap, setMaxCap] = useState('350');

    const isWebLayout = windowWidth > 768;

    useEffect(() => {
        fetch('http://192.168.100.95:8000/api/espacios')
            .then(res => res.json())
            .then(data => {
                setEspacios(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar espacios:", err);
                setLoading(false);
            });
    }, []);

    const filtrados = espacios.filter(e => {
        const coincideCategoria = filtro === 'Todos' || e.tipo === filtro;
        const nombreEspacio = e.nombre ? e.nombre.toLowerCase() : "";
        const edificioEspacio = e.edificio ? e.edificio.toLowerCase() : "";
        const coincideBusqueda = nombreEspacio.includes(busqueda.toLowerCase()) || edificioEspacio.includes(busqueda.toLowerCase());
        const capacidad = e.capacidad || 0;
        const coincideCapacidad = capacidad >= parseInt(minCap || 0) && capacidad <= parseInt(maxCap || 1000);

        return coincideCategoria && coincideBusqueda && coincideCapacidad;
    });

    return (
        <View style={styles.mainContainer}>
            <Header userName={usuario} role="Alumno" navigation={navigation} isWeb={isWebLayout}/>

            <ScrollView contentContainerStyle={styles.centeredContent}>
                <Text style={styles.explorarTitle}>Explorar espacios</Text>
                
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput 
                        placeholder="Buscar espacios, laboratorios..." 
                        style={styles.searchInput}
                        value={busqueda}
                        onChangeText={setBusqueda}
                    />
                    <TouchableOpacity 
                        style={[styles.filterToggle, showFilters && { backgroundColor: '#e2e8f0' }]} 
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Ionicons name="options-outline" size={20} color="#1f2937" />
                        <Text style={styles.filterToggleText}>Filtros</Text>
                    </TouchableOpacity>
                </View>

                {/* PANEL DE FILTROS DINÁMICO */}
                {showFilters && (
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={{ fontWeight: '700', fontSize: 16 }}>Filtros</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <Ionicons name="close" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: '#475569', marginBottom: 10 }}>Capacidad: {minCap} - {maxCap} personas</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 5 }}>Mínimo</Text>
                                <TextInput 
                                    style={{ borderWeight: 1, borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 8, padding: 8 }}
                                    keyboardType="numeric"
                                    value={minCap}
                                    onChangeText={setMinCap}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 5 }}>Máximo</Text>
                                <TextInput 
                                    style={{ borderWeight: 1, borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 8, padding: 8 }}
                                    keyboardType="numeric"
                                    value={maxCap}
                                    onChangeText={setMaxCap}
                                />
                            </View>
                        </View>
                    </View>
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                    {CATEGORIAS.map(cat => (
                        <TouchableOpacity 
                            key={cat} 
                            style={[styles.catBadge, filtro === cat && styles.catBadgeActive]}
                            onPress={() => setFiltro(cat)}
                        >
                            <Text style={[styles.catText, filtro === cat && styles.catTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.gridEspacios}>
                    {filtrados.map(esp => (
                        <TouchableOpacity 
                            key={esp.id} 
                            style={styles.card}
                            onPress={() => navigation.navigate('FormularioReserva', { espacio: esp, usuario: usuario })}
                        >
                            <View style={styles.imageContainer}>
                                <Image source={IMAGENES_DEFAULT[esp.tipo] || IMAGENES_DEFAULT['Default']} style={styles.cardImage} />
                            </View>
                            <View style={styles.cardBody}>
                                <Text style={styles.cardName}>{esp.nombre}</Text>
                                <Text style={styles.cardLocation}>{esp.ubicacion}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.statusText}>{esp.capacidad} pers.</Text>
                                    <TouchableOpacity style={styles.btnSolicitar} onPress={() => navigation.navigate('FormularioReserva', { espacio: esp, usuario: usuario })}>
                                        <Text style={styles.btnText}>Solicitar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default EspaciosScreen;