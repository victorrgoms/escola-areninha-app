import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { signOut } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header Azul */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={30} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut}>
          <MaterialCommunityIcons name="account-circle" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Logo Central */}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="soccer" size={60} color="#00838F" />
          <Text style={styles.logoTitle}>ARENINHA</Text>
          <Text style={styles.logoSubtitle}>Escola Areninha</Text>
        </View>

        {/* Card do Mapa Específico */}
        <View style={styles.mapCard}>
          <View style={styles.mapCardHeader}>
            <Text style={styles.mapCardTitle}>MAPA DAS ARENINHAS</Text>
            <MaterialCommunityIcons name="dots-horizontal" size={20} color="#FFF" />
          </View>
          
          <View style={styles.mapCardBody}>
            {/* Simulação da imagem do mapa com um View cinza.*/}
            <View style={styles.mapImagePlaceholder}>
              <FontAwesome5 name="map-marker-alt" size={40} color="#00838F" style={{ marginTop: 20 }} />
              <Text style={styles.mapCityText}>Fortaleza</Text>
              
              <TouchableOpacity 
                style={styles.openMapButton} 
                onPress={() => navigation.navigate('Map')}
              >
                <Text style={styles.openMapButtonText}>Abrir Mapa</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.areninhaNameText}>Areninha Unidade X</Text>
          </View>
        </View>

        {/* Grid de Botões Inferiores */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={[styles.gridButton, { backgroundColor: '#FFF9C4' }]}>
            <MaterialCommunityIcons name="calendar-check" size={35} color="#F57F17" />
            <Text style={styles.gridButtonText}>Calendário</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridButton, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="account-group" size={35} color="#2E7D32" />
            <Text style={styles.gridButtonText}>Equipe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridButton, { backgroundColor: '#E3F2FD' }]}>
            <MaterialCommunityIcons name="image-multiple" size={35} color="#1565C0" />
            <Text style={styles.gridButtonText}>Galeria</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Menu Inferior (Bottom Tab Bar Simulada) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="home" size={28} color="#00838F" />
          <Text style={[styles.navText, { color: '#00838F' }]}>Início</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={28} color="#999" />
          <Text style={styles.navText}>Frequência</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="clipboard-check-outline" size={28} color="#999" />
          {/* Item extra sem texto igual a imagem */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account-outline" size={28} color="#999" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#00838F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00838F',
    marginTop: -5,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  mapCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 25,
    overflow: 'hidden',
  },
  mapCardHeader: {
    backgroundColor: '#00838F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 15,
  },
  mapCardTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  mapCardBody: {
    padding: 15,
  },
  mapImagePlaceholder: {
    height: 180,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  openMapButton: {
    backgroundColor: '#00838F',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    position: 'absolute',
    bottom: 20,
  },
  openMapButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  areninhaNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gridButtonText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  }
});