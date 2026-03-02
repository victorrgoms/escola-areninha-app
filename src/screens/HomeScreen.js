import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import HeaderApp from '../components/HeaderApp'; // <-- Importando o cabeçalho novo

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho Padronizado (Sem botão de voltar na Home) */}
        <HeaderApp />

        <View style={styles.content}>
          <View style={styles.mapCard}>
            <View style={styles.mapCardHeader}>
              <Text style={styles.mapCardTitle}>MAPA DAS ARENINHAS</Text>
            </View>
            <TouchableOpacity 
            style={styles.mapCardBody}
            onPress={() => navigation.navigate('Map')}>
              <View style={styles.mapImagePlaceholder}>
                <FontAwesome5 name="map-marker-alt" size={40} color="#00838F" style={{ marginTop: 20 }} />
                <Text style={styles.mapCityText}>Fortaleza</Text>
              </View>
              <Text style={styles.areninhaNameText}>Areninha Unidade X</Text>
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

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="image-multiple" size={35} color="#1565C0" />
              <Text style={styles.gridButtonText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 20 },
  // Mantive os estilos dos cards iguais
  mapCard: { backgroundColor: '#FFF', borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4, marginBottom: 25, overflow: 'hidden' },
  mapCardHeader: { backgroundColor: '#00838F', flexDirection: 'row', justifyContent: 'space-between', padding: 12, paddingHorizontal: 15 },
  mapCardTitle: { color: '#FFF', fontWeight: 'regular', fontSize: 14 },
  mapCardBody: { padding: 8 },
  mapImagePlaceholder: { height: 180, backgroundColor: '#70b5d1', alignItems: 'center', justifyContent: 'center'},
  mapCityText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
  openMapButton: { backgroundColor: '#00838F', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 25, position: 'absolute', bottom: 20 },
  openMapButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  areninhaNameText: { fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 15, textAlign: 'center', paddingVertical: 5, bottom: 5 },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  gridButton: { width: '31%', aspectRatio: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  gridButtonText: { marginTop: 10, fontSize: 13, fontWeight: 'bold', color: '#333' },
});