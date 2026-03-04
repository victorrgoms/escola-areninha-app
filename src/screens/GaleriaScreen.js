import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import HeaderApp from '../components/HeaderApp';

export default function GaleriaScreen() {
  // algumas fotos padrao so pra preencher o layout inicial
  const [fotos, setFotos] = useState([
    'https://images.unsplash.com/photo-1518605368461-1ee7c5320e73?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbb1925813?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1551280857-2b9ebf262c51?auto=format&fit=crop&w=300&q=80',
  ]);

  const adicionarFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      // joga a foto nova logo no começo da grade
      setFotos([result.assets[0].uri, ...fotos]);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/background.png')} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        <HeaderApp showBack={true} />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Galeria</Text>
            
            <TouchableOpacity onPress={adicionarFoto}>
              <MaterialCommunityIcons name="camera-outline" size={30} color="#00838F" />
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {fotos.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.gridImage} />
            ))}
          </View>
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // espalha os 3 itens certinho na linha
  },
  gridImage: {
    width: '31%', 
    aspectRatio: 1, // deixa quadrado perfeito independente do tamanho da tela
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#E0E0E0', // cor de fundo enquanto a foto carrega
  }
});