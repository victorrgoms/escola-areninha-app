import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderApp from '../components/HeaderApp';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);

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

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <HeaderApp />

        <View style={styles.content}>
          
          {/* CARD DE LOTAÇÃO (Elegante e focado na informação) */}
          <View style={styles.infoCard}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="soccer-field" size={28} color="#FFF" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>MINHA LOTAÇÃO</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {usuario?.areninha?.nome ? usuario.areninha.nome : 'Carregando unidade...'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Acesso Rápido</Text>

          {/* BOTÃO LOCALIZAR (Largura Total) */}
          <TouchableOpacity 
            style={styles.fullButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={styles.fullButtonLeft}>
              <MaterialCommunityIcons name="map-search-outline" size={32} color="#00838F" />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.fullButtonTitle}>Localizar Areninhas</Text>
                <Text style={styles.fullButtonSub}>Buscar unidades e traçar rotas</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>

          {/* GRID DE BOTÕES (Equipe e Galeria dividindo a tela) */}
          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={[styles.halfButton, { backgroundColor: '#E8F5E9' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Equipe')} // <-- Adicione esta linha!
            >
              <MaterialCommunityIcons name="account-group" size={40} color="#2E7D32" />
              <Text style={styles.halfButtonText}>Equipe</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.halfButton, { backgroundColor: '#E3F2FD' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Galeria')}
            >
              <MaterialCommunityIcons name="image-multiple" size={40} color="#1565C0" />
              <Text style={styles.halfButtonText}>Galeria</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  content: { paddingHorizontal: 20, marginTop: -10 }, // Margin top negativo compensa o espaço da logo
  
  // Estilos do novo Card de Lotação
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: '#00838F'
  },
  iconWrapper: {
    backgroundColor: '#00838F',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },

  // Estilo do Botão Full Width (Localizar)
  fullButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  fullButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fullButtonSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  // Estilo dos botões Half Width (Equipe e Galeria)
  gridContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  halfButton: { 
    width: '48%', 
    height: 110, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  halfButtonText: { 
    marginTop: 10, 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333' 
  },
});