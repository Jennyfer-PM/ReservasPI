import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import espaciosStyles from '../styles/espaciosStyles';
import homeStyles from '../styles/alumnoHomeStyles'; // Importamos los estilos del home para el header

const BREAKPOINT = 768;

const espaciosScreen = ({ navigation }) => {
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    const [filtroActivo, setFiltroActivo] = useState('Todos');

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const isWebLayout = windowWidth > BREAKPOINT;
    const categorias = ['Todos', 'Laboratorios', 'Auditorios', 'Salas', 'Talleres', 'Biblioteca', 'Salas de Cómputo'];

    const espaciosData = [
        { id: 1, titulo: 'Laboratorio de Química General', ubicacion: 'Edificio de Ciencias • Piso 2', capacidad: '30 personas', equipos: '3 equipos', tag: 'Laboratorios' },
        { id: 2, titulo: 'Auditorio Principal', ubicacion: 'Edificio Central • Planta Baja', capacidad: '350 personas', equipos: '4 equipos', tag: 'Auditorios' },
        { id: 3, titulo: 'Sala de Estudio - Biblioteca', ubicacion: 'Biblioteca Central • Piso 3', capacidad: '40 personas', equipos: '4 equipos', tag: 'Biblioteca' },
        { id: 4, titulo: 'Sala de Juntas A', ubicacion: 'Edificio Administrativo • Piso 4', capacidad: '20 personas', equipos: '3 equipos', tag: 'Salas' },
        { id: 5, titulo: 'Laboratorio de Cómputo A', ubicacion: 'Edificio de Ingeniería • Piso 1', capacidad: '35 personas', equipos: '3 equipos', tag: 'Salas de Cómputo' },
        { id: 6, titulo: 'Taller de Diseño Industrial', ubicacion: 'Edificio de Diseño • Piso 1', capacidad: '25 personas', equipos: '3 equipos', tag: 'Talleres' },
    ];

    const getImagenPorTag = (tag) => {
        switch (tag) {
            case 'Laboratorios': return require('../../assets/laboratorio.jpg');
            case 'Auditorios': return require('../../assets/auditorio.jpg');
            case 'Biblioteca': return require('../../assets/biblioteca.jpg');
            case 'Salas': return require('../../assets/sala.jpg');
            case 'Salas de Cómputo': return require('../../assets/salacomputo.jpg');
            case 'Talleres': return require('../../assets/taller.jpg');
            default: return require('../../assets/laboratorio.jpg');
        }
    };

    const espaciosFiltrados = filtroActivo === 'Todos' 
        ? espaciosData 
        : espaciosData.filter(e => e.tag === filtroActivo);

    return (
        <View style={espaciosStyles.mainContainer}>
            {/* HEADER CORREGIDO - COPIADO DE ALUMNOHOME */}
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
                            <Text style={{ fontWeight: '600', color: '#00d97e' }}>Espacios</Text>
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

            <ScrollView style={espaciosStyles.contentScroll}>
                <View style={isWebLayout ? espaciosStyles.centeredContentWeb : espaciosStyles.mobilePadding}>
                    <Text style={espaciosStyles.mainTitle}>Explorar espacios</Text>
                    <Text style={espaciosStyles.subTitle}>Encuentra el espacio perfecto para tu actividad académica</Text>

                    <View style={espaciosStyles.searchRow}>
                        <View style={espaciosStyles.searchBar}>
                            <Ionicons name="search-outline" size={20} color="#999" />
                            <TextInput placeholder="Buscar espacios..." style={espaciosStyles.searchInput} />
                        </View>
                        <TouchableOpacity style={espaciosStyles.filterButton}>
                            <Ionicons name="options-outline" size={20} color="#333" />
                            <Text style={espaciosStyles.filterButtonText}>Filtros</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={true} 
                        persistentScrollbar={true}
                        style={espaciosStyles.categoriesScroll}
                        contentContainerStyle={espaciosStyles.scrollContainer}
                    >
                        {categorias.map((cat) => (
                            <TouchableOpacity 
                                key={cat} 
                                onPress={() => setFiltroActivo(cat)}
                                style={[espaciosStyles.categoryChip, filtroActivo === cat && espaciosStyles.categoryChipActive]}
                            >
                                <Text style={[espaciosStyles.categoryText, filtroActivo === cat && espaciosStyles.categoryTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={espaciosStyles.resultsCount}>{espaciosFiltrados.length} espacios encontrados</Text>

                    <View style={espaciosStyles.gridEspacios}>
                        {espaciosFiltrados.map((espacio) => (
                            <EspacioCard 
                                key={espacio.id}
                                titulo={espacio.titulo}
                                ubicacion={espacio.ubicacion}
                                capacidad={espacio.capacidad}
                                equipos={espacio.equipos}
                                tag={espacio.tag}
                                imagen={getImagenPorTag(espacio.tag)} 
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const EspacioCard = ({ titulo, ubicacion, capacidad, equipos, tag, imagen }) => (
    <View style={espaciosStyles.card}>
        <View style={espaciosStyles.imageContainer}>
            <Image source={imagen} style={espaciosStyles.cardImage} />
            <View style={espaciosStyles.tagBadge}><Text style={espaciosStyles.tagText}>{tag}</Text></View>
        </View>
        <View style={espaciosStyles.cardContent}>
            <Text style={espaciosStyles.cardTitle}>{titulo}</Text>
            <Text style={espaciosStyles.cardLocation}>{ubicacion}</Text>
            <View style={espaciosStyles.cardDetails}>
                <Text style={espaciosStyles.detailItem}><Ionicons name="people-outline" size={14} /> {capacidad}</Text>
                <Text style={espaciosStyles.detailItem}><Ionicons name="desktop-outline" size={14} /> {equipos}</Text>
            </View>
            <View style={espaciosStyles.cardFooter}>
                <View style={espaciosStyles.statusBadge}><Text style={espaciosStyles.statusText}>Disponible</Text></View>
                <TouchableOpacity style={espaciosStyles.btnSolicitar}>
                    <Text style={espaciosStyles.btnText}>Solicitar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default espaciosScreen;