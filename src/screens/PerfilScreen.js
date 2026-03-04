import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import HeaderApp from '../components/HeaderApp';
import api from '../services/api';

export default function PerfilScreen() {
  const { signOut } = useContext(AuthContext);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await api.get('/usuarios/me');
        setUsuario(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    }
    carregarPerfil();
  }, []);

  // API pública pra gerar um avatar com a inicial do nome caso não tenha foto
  const avatarUrl = usuario?.fotoUrl || `https://ui-avatars.com/api/?name=${usuario?.nome || 'U'}&background=00838F&color=fff&size=200`;

  return (
    <ImageBackground source={require('../../assets/images/background.png')} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Passamos só o botão de voltar pro Header, sem título, pra ficar igual a arte */}
        <HeaderApp showBack={true} />

        <View style={styles.content}>
          <Text style={styles.pageTitle}>Meu Perfil</Text>

          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator size="large" color="#00838F" style={{ marginTop: 20 }} />
            ) : (
              <>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                </View>

                <Text style={styles.userName}>{usuario?.nome || 'Carregando...'}</Text>
                <Text style={styles.userRole}>
                  Monitor {usuario?.areninha?.nome ? `da ${usuario.areninha.nome}` : 'da Areninha'}
                </Text>

                <View style={styles.infoSection}>
                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="email" size={22} color="#00838F" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{usuario?.email || 'Sem e-mail cadastrado'}</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="phone" size={22} color="#00838F" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{usuario?.telefone || '(00) 00000-0000'}</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="account-group" size={22} color="#00838F" style={styles.infoIcon} />
                    <Text style={styles.infoText}>Monitor</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                  <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
              </>
            )}
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
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 15,
    marginTop: -10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 5,
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});