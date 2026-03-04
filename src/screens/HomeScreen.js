import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps'; // <-- Importando os componentes do mapa
import HeaderApp from '../components/HeaderApp';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  // Assim como no perfil, buscamos os dados do usuário logo que a Home abre
  useEffect(() => {
    async function carregarPerfilHome() {
      try {
        const response = await api.get('/usuarios/me');
        setUsuario(response.data);
      } catch (error) {
        console.log("Erro ao carregar os dados da Home.");
      }
    }
    carregarPerfilHome();
  }, []);

  // Pegando as coordenadas da Areninha do usuário (com fallback pra Fortaleza caso não tenha)
  const lat = usuario?.areninha?.latitude ? Number(usuario.areninha.latitude) : -3.7319;
  const lng = usuario?.areninha?.longitude ? Number(usuario.areninha.longitude) : -38.5267;
  const temAreninhaVinculada = !!usuario?.areninha;

  return (
    // Transformamos a View principal no ImageBackground!
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <HeaderApp />

        <View style={styles.content}>
          <View style={styles.mapCard}>
            <View style={styles.mapCardHeader}>
              <Text style={styles.mapCardTitle}>MAPA DAS ARENINHAS</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.mapCardBody}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Map')}
            >
              <View style={styles.mapImagePlaceholder}>
                
                {/* Aqui entra o pulo do gato: o pointerEvents="none" desativa os gestos no mapa, 
                    transformando ele numa imagem estática pra não bugar a rolagem da tela */}
                <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
                  <MapView
                    provider="google"
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={{
                      latitude: lat,
                      longitude: lng,
                      latitudeDelta: 0.01, // Um zoom bem focado na areninha
                      longitudeDelta: 0.01,
                    }}
                  >
                    {/* Se o cara tiver areninha, bota o pino vermelhinho nela */}
                    {temAreninhaVinculada && (
                      <Marker coordinate={{ latitude: lat, longitude: lng }} />
                    )}
                  </MapView>
                </View>

              </View>

              {/* Título dinâmico puxando do banco */}
              <Text style={styles.areninhaNameText}>
                {usuario?.areninha?.nome ? `${usuario.areninha.nome}` : 'Carregando unidade...'}
              </Text>

            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            <TouchableOpacity style={[styles.gridButton, { backgroundColor: '#FFF9C4' }]}>
              <MaterialCommunityIcons name="calendar-check" size={35} color="#F57F17" />
              <Text style={styles.gridButtonText}>Calendário</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="account-group" size={35} color="#2E7D32" />
              <Text style={styles.gridButtonText}>Equipe</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.gridButton, { backgroundColor: '#E3F2FD' }]}
              onPress={() => navigation.navigate('Galeria')}
            >
              <MaterialCommunityIcons name="image-multiple" size={35} color="#1565C0" />
              <Text style={styles.gridButtonText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Tirei o backgroundColor daqui pra imagem de fundo aparecer!
  container: { flex: 1 }, 
  content: { padding: 20 },
  
  mapCard: { backgroundColor: '#FFF', borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4, marginBottom: 25, overflow: 'hidden' },
  mapCardHeader: { backgroundColor: '#00838F', flexDirection: 'row', justifyContent: 'space-between', padding: 12, paddingHorizontal: 15 },
  mapCardTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  mapCardBody: { padding: 8 },
  
  // Agora o placeholder só precisa ter overflow hidden pro mapa ficar com as bordinhas arredondadas por dentro
  mapImagePlaceholder: { height: 180, backgroundColor: '#E0E0E0', borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  
  areninhaNameText: { fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 15, textAlign: 'center', paddingVertical: 5, bottom: 5 },
  
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  gridButton: { width: '31%', aspectRatio: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  gridButtonText: { marginTop: 10, fontSize: 13, fontWeight: 'bold', color: '#333' },
});