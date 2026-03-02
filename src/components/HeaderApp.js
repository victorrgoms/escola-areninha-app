import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// O cabeçalho recebe se deve mostrar o botao de voltar, e os textos opcionais
export default function HeaderApp({ showBack = false, title, subtitle }) {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {/* Botão de voltar no canto superior esquerdo */}
      {showBack && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Inicio')}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
      )}

        <View style={styles.logoWrapper}>
            <Image 
                source={require('../../assets/images/Areninha_logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
                />
            </View>
                <View style={styles.titleWrapper}>
                    <View style={styles.subtitleContainer}>
                    <View style={styles.line} />
                    <Text style={styles.schoolName}>- Escola Areninha -</Text>
                <View style={styles.line} />
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: -10,
  },
  logoImage: {
    width: 180,
    height: 110,
  },
  schoolName: {
    fontSize: 16,
    top: -18,
    fontWeight: 'bold',
    color: '#0c9683',
    marginHorizontal: 10,
  },
  titleWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#E0F7FA',
    marginTop: 2,
  }
});