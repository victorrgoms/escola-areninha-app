import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Linking, Platform, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../services/api';

export default function MapScreen() {
  const [areninhas, setAreninhas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarAreninhas() {
      try {
        const response = await api.get('/areninhas');
        setAreninhas(response.data);
      } catch (error) {
        Alert.alert('Deu ruim', 'Não consegui buscar as areninhas do servidor.');
      } finally {
        setLoading(false);
      }
    }
    carregarAreninhas();
  }, []);

  // joga a coordenada pro waze/maps do proprio celular
  function tracarRota(lat, lng, nome) {
    const latLng = `${lat},${lng}`;
    
    // esquema diferente pro ios e pro android
    const url = Platform.select({
      ios: `maps:0,0?q=${nome}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${nome})`
    });

    Linking.openURL(url).catch(() => {
      Alert.alert('Ops', 'Não encontrei nenhum app de mapa instalado.');
    });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  // Se estiver rodando na web, mostra um aviso em vez de quebrar o app
  if (Platform.OS === 'web') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', padding: 20 }}>
          O mapa interativo só funciona no aplicativo de celular. Abra no Expo Go!
        </Text>
      </View>
    );
  }

  // Se for celular, renderiza o mapa normalmente
  return (
    <View style={styles.container}>
      <MapView
        provider="google"
        style={styles.map}
        initialRegion={{
          latitude: -3.7319,
          longitude: -38.5267,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {areninhas
          // Filtra pra não tentar renderizar areninha sem coordenada
          .filter(item => item.latitude != null && item.longitude != null)
          .map(item => (
            <Marker
              key={item.id}
              coordinate={{ 
                latitude: Number(item.latitude), 
                longitude: Number(item.longitude) 
              }}
              title={item.nome}
              description="Toque aqui para abrir a rota"
              onCalloutPress={() => tracarRota(item.latitude, item.longitude, item.nome)}
            />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
  }
});