import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, 
  ScrollView, Image, Modal, TextInput, ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import HeaderApp from '../components/HeaderApp';
import api from '../services/api';

export default function GaleriaScreen() {
  const [fotos, setFotos] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  
  // Estados para o Modal de Nova Publicação
  const [modalVisivel, setModalVisivel] = useState(false);
  const [fotoSelecionadaBase64, setFotoSelecionadaBase64] = useState(null);
  const [legenda, setLegenda] = useState('');
  const [publicando, setPublicando] = useState(false);

  // Estado para o Modal de Ver a Foto Grande
  const [fotoExpandida, setFotoExpandida] = useState(null);

  useEffect(() => {
    carregarGaleria();
  }, []);

  async function carregarGaleria() {
    try {
      const response = await api.get('/imagens');
      setFotos(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a galeria.");
    } finally {
      setLoadingList(false);
    }
  }

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ops', 'Precisamos de permissão para aceder à sua galeria!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3, 
      base64: true,
    });

    if (!result.canceled) {
      setFotoSelecionadaBase64(result.assets[0].base64);
      setLegenda('');
      setModalVisivel(true);
    }
  };

  const publicarFoto = async () => {
    if (!fotoSelecionadaBase64) return;
    
    setPublicando(true);
    try {
      await api.post('/imagens', {
        base64: fotoSelecionadaBase64,
        descricao: legenda
      });
      
      Alert.alert("Sucesso", "Foto publicada na galeria!");
      setModalVisivel(false);
      setFotoSelecionadaBase64(null);
      carregarGaleria(); 
      
    } catch (error) {
      Alert.alert("Erro", "Não foi possível publicar a foto.");
    } finally {
      setPublicando(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/background.png')} style={styles.container}>
      <HeaderApp showBack={true} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Nossa Galeria</Text>
          
          <TouchableOpacity style={styles.addBtn} onPress={escolherFoto}>
            <MaterialCommunityIcons name="camera-plus" size={24} color="#FFF" />
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {loadingList ? (
          <ActivityIndicator size="large" color="#00838F" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            {fotos.length > 0 ? (
              <View style={styles.gridContainer}>
                {fotos.map((item) => (
                  <TouchableOpacity 
                    key={item.id.toString()} 
                    style={styles.mosaicItem}
                    activeOpacity={0.8}
                    onPress={() => setFotoExpandida(item)}
                  >
                    <Image 
                      source={{ uri: `data:image/jpeg;base64,${item.url}` }} 
                      style={styles.mosaicImage} 
                    />
                    {/* Tarja escura na parte de baixo com o nome da Areninha */}
                    <View style={styles.mosaicOverlay}>
                      <View style={styles.locationRow}>
                        <MaterialCommunityIcons name="map-marker" size={12} color="#FFF" />
                        <Text style={styles.overlayText} numberOfLines={1}>
                          {item.nomeAreninha}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="image-multiple-outline" size={60} color="#CCC" />
                <Text style={styles.emptyText}>Nenhuma foto registada ainda.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* MODAL 1: NOVA PUBLICAÇÃO */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Publicação</Text>
            
            {fotoSelecionadaBase64 && (
              <Image 
                source={{ uri: `data:image/jpeg;base64,${fotoSelecionadaBase64}` }} 
                style={styles.previewImage} 
              />
            )}

            <TextInput
              style={styles.legendaInput}
              placeholder="Escreva uma legenda para a foto..."
              multiline
              numberOfLines={4}
              value={legenda}
              onChangeText={setLegenda}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisivel(false)} disabled={publicando}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.publishBtn} onPress={publicarFoto} disabled={publicando}>
                {publicando ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.publishBtnText}>Publicar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: FOTO EXPANDIDA (Ao clicar no mosaico) */}
      <Modal visible={fotoExpandida !== null} animationType="fade" transparent={true}>
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity style={styles.closeFullscreenBtn} onPress={() => setFotoExpandida(null)}>
            <MaterialCommunityIcons name="close" size={32} color="#FFF" />
          </TouchableOpacity>

          {fotoExpandida && (
            <View style={styles.fullscreenCard}>
              <View style={styles.fullscreenHeader}>
                <View style={styles.avatarMock}>
                  <Text style={styles.avatarMockText}>{fotoExpandida.nomeUsuario.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fullscreenAuthor}>{fotoExpandida.nomeUsuario}</Text>
                  <Text style={styles.fullscreenDate}>
                    {fotoExpandida.dataFormatada} • {fotoExpandida.nomeAreninha}
                  </Text>
                </View>
              </View>

              <Image 
                source={{ uri: `data:image/jpeg;base64,${fotoExpandida.url}` }} 
                style={styles.fullscreenImage} 
              />

              {fotoExpandida.descricao ? (
                <View style={styles.fullscreenFooter}>
                  <Text style={styles.fullscreenCaption}>{fotoExpandida.descricao}</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </Modal>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { flex: 1, paddingHorizontal: 15, marginTop: 10 },
  
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  addBtn: { flexDirection: 'row', backgroundColor: '#00838F', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  addBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },

  // Estilos do Mosaico (Grid)
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  mosaicItem: { width: '48%', aspectRatio: 1, marginBottom: 15, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EEE', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  mosaicImage: { width: '100%', height: '100%' },
  mosaicOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 6, paddingHorizontal: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  overlayText: { color: '#FFF', fontSize: 11, fontWeight: '600', marginLeft: 4, flex: 1 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 15 },

  // Estilos do Modal de Nova Publicação
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  previewImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 15 },
  legendaInput: { width: '100%', backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 15, minHeight: 80, textAlignVertical: 'top', fontSize: 15, marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', marginRight: 10 },
  cancelBtnText: { color: '#888', fontWeight: 'bold', fontSize: 16 },
  publishBtn: { flex: 1, backgroundColor: '#00838F', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginLeft: 10 },
  publishBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // Estilos do Modal de Foto Expandida
  fullscreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  closeFullscreenBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10, padding: 10 },
  fullscreenCard: { width: '90%', backgroundColor: '#FFF', borderRadius: 15, overflow: 'hidden' },
  fullscreenHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  avatarMock: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F7FA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarMockText: { color: '#00838F', fontWeight: 'bold', fontSize: 18 },
  fullscreenAuthor: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  fullscreenDate: { fontSize: 12, color: '#666', marginTop: 2 },
  fullscreenImage: { width: '100%', aspectRatio: 4/3, backgroundColor: '#000' },
  fullscreenFooter: { padding: 15 },
  fullscreenCaption: { fontSize: 15, color: '#333', lineHeight: 22 }
});