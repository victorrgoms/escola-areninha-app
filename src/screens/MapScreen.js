import React, { useEffect, useState } from 'react';
import { 
  View, StyleSheet, ActivityIndicator, Alert, Linking, 
  Platform, Text, TextInput, ScrollView, TouchableOpacity, ImageBackground 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderApp from '../components/HeaderApp';
import api from '../services/api';

export default function MapScreen() {
  const [areninhas, setAreninhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function carregarAreninhas() {
      try {
        const response = await api.get('/areninhas');
        setAreninhas(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não consegui buscar a lista de areninhas do servidor.');
      } finally {
        setLoading(false);
      }
    }
    carregarAreninhas();
  }, []);

  // Abre o Google Maps (Android) ou Apple Maps (iOS) traçando a rota
  function abrirMapa(lat, lng, nome) {
    if (!lat || !lng) {
      Alert.alert('Atenção', 'Coordenadas indisponíveis para esta unidade.');
      return;
    }

    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${nome}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${nome})`
    });

    Linking.openURL(url).catch(() => {
      Alert.alert('Ops', 'Não encontrei nenhum app de mapa instalado no seu celular.');
    });
  }

  // Filtra a lista conforme o usuário digita na barra de pesquisa
  const areninhasFiltradas = areninhas.filter(item => 
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
    >
      <HeaderApp showBack={true} />

      <View style={styles.content}>
        
        {/* BARRA DE BUSCA */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={24} color="#00838F" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Areninha..."
            value={busca}
            onChangeText={setBusca}
            placeholderTextColor="#999"
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>

        {/* LISTA DE ARENINHAS */}
        {loading ? (
          <ActivityIndicator size="large" color="#00838F" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {areninhasFiltradas.length > 0 ? (
              areninhasFiltradas.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.cardItem}
                  activeOpacity={0.7}
                  onPress={() => abrirMapa(item.latitude, item.longitude, item.nome)}
                >
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text style={styles.cardSubtitle}>
                      <MaterialCommunityIcons name="navigation-variant" size={14} /> Tocar para traçar rota
                    </Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="map-marker-radius" size={28} color="#FFF" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="map-search-outline" size={50} color="#CCC" />
                <Text style={styles.emptyText}>Nenhuma areninha encontrada.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, flex: 1, marginTop: 10 },
  
  searchBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 20, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  
  cardItem: { 
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 15, padding: 15, 
    marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0'
  },
  cardTextContainer: { flex: 1, paddingRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 13, color: '#00838F', marginTop: 4, fontWeight: '600' },
  
  iconContainer: { 
    backgroundColor: '#00838F', width: 50, height: 50, borderRadius: 25, 
    justifyContent: 'center', alignItems: 'center', shadowColor: '#00838F', 
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3
  },
  
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#666', fontSize: 16, marginTop: 10 }
});