import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  ImageBackground, Modal, ActivityIndicator, Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderApp from '../components/HeaderApp';
import api from '../services/api';

export default function EquipeScreen() {
  const [usuario, setUsuario] = useState(null);
  const [areninhas, setAreninhas] = useState([]);
  const [areninhaSelecionada, setAreninhaSelecionada] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lista simulada de monitores (Até o backend ter a rota pronta)
  const monitoresMock = [
    { id: 1, nome: 'João Pedro Santos', area: 'Monitor de Esportes', avatar: 'https://ui-avatars.com/api/?name=João+Pedro&background=E0F7FA&color=00838F' },
    { id: 2, nome: 'Felipe Almeida', area: 'Monitor de Matemática', avatar: 'https://ui-avatars.com/api/?name=Felipe+Almeida&background=E0F7FA&color=00838F' },
    { id: 3, nome: 'André Cardoso', area: 'Monitor de Ingles', avatar: 'https://ui-avatars.com/api/?name=André+Cardoso&background=E0F7FA&color=00838F' },
    { id: 4, nome: 'Matheus Oliveira', area: 'Monitor de Portugues', avatar: 'https://ui-avatars.com/api/?name=Matheus+Oliveira&background=E0F7FA&color=00838F' },
  ];

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca o perfil do usuário para pegar a areninha dele
        const resUser = await api.get('/usuarios/me');
        setUsuario(resUser.data);
        
        // Busca a lista de todas as areninhas pro Dropdown
        const resAreninhas = await api.get('/areninhas');
        setAreninhas(resAreninhas.data);

        // Define a areninha padrão como a lotada do usuário
        if (resUser.data.areninha) {
          setAreninhaSelecionada(resUser.data.areninha);
        } else if (resAreninhas.data.length > 0) {
          setAreninhaSelecionada(resAreninhas.data[0]);
        }
      } catch (error) {
        console.log('Erro ao carregar dados da equipe:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const selecionarAreninha = (areninha) => {
    setAreninhaSelecionada(areninha);
    setModalVisivel(false);
  };

  if (loading) {
    return (
      <ImageBackground source={require('../../assets/images/background.png')} style={styles.loadingContainer}>
        <HeaderApp showBack={true} />
        <ActivityIndicator size="large" color="#00838F" style={{ marginTop: 50 }} />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <HeaderApp showBack={true} />

        <View style={styles.content}>
          
          {/* SELETOR DE ARENINHA */}
          <View style={styles.selectorCard}>
            <Text style={styles.sectionTitle}>Areninha Selecionada</Text>
            
            <TouchableOpacity 
              style={styles.selectorBox} 
              activeOpacity={0.7}
              onPress={() => setModalVisivel(true)}
            >
              <View style={styles.selectorLeft}>
                <MaterialCommunityIcons name="map-marker" size={24} color="#FBC02D" />
                <Text style={styles.selectorText} numberOfLines={1}>
                  {areninhaSelecionada?.nome || 'Selecione uma Areninha'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* LISTA DE EQUIPE */}
          <Text style={styles.listTitle}>
            Monitores da {areninhaSelecionada?.nome || 'Areninha'}
          </Text>

          <View style={styles.listContainer}>
            {monitoresMock.map((monitor) => (
              <View key={monitor.id} style={styles.monitorCard}>
                <Image source={{ uri: monitor.avatar }} style={styles.avatar} />
                <View style={styles.monitorInfo}>
                  <Text style={styles.monitorNome}>{monitor.nome}</Text>
                  <Text style={styles.monitorArea}>{monitor.area}</Text>
                </View>
              </View>
            ))}
          </View>

        </View>

      </ScrollView>

      {/* MODAL PARA ESCOLHER OUTRA ARENINHA */}
      <Modal visible={modalVisivel} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha a Areninha</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <MaterialCommunityIcons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {areninhas.map((a) => (
                <TouchableOpacity 
                  key={a.id} 
                  style={styles.modalItem}
                  onPress={() => selecionarAreninha(a)}
                >
                  <MaterialCommunityIcons 
                    name={areninhaSelecionada?.id === a.id ? "radiobox-marked" : "radiobox-blank"} 
                    size={24} 
                    color="#00838F" 
                  />
                  <Text style={styles.modalItemText}>{a.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1 },
  content: { paddingHorizontal: 20, marginTop: -5 },
  
  selectorCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 25,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 12 },
  selectorBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 15, height: 55,
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  selectorText: { fontSize: 16, color: '#333', marginLeft: 10, fontWeight: '500', flex: 1 },

  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 15, marginLeft: 5 },
  listContainer: { paddingBottom: 20 },
  
  monitorCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 16, padding: 15, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#E0F7FA' },
  monitorInfo: { marginLeft: 15, flex: 1 },
  monitorNome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  monitorArea: { fontSize: 14, color: '#666', marginTop: 2 },

  // Estilos do Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalItemText: { fontSize: 16, color: '#444', marginLeft: 15 }
});