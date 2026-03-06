import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Image, ImageBackground 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

const { height } = Dimensions.get('window');

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [turnoSelecionado, setTurnoSelecionado] = useState('Ambos');
  const [areninhas, setAreninhas] = useState([]);
  const [areninhaSelecionada, setAreninhaSelecionada] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const turnosDisponiveis = ['Manhã', 'Tarde', 'Ambos'];

  useEffect(() => {
    async function carregarAreninhas() {
      try {
        const response = await api.get('/areninhas');
        setAreninhas(response.data);
      } catch (error) {
        console.log("Erro ao carregar areninhas:", error);
      }
    }
    carregarAreninhas();
  }, []);

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    if (!areninhaSelecionada) {
      Alert.alert('Atenção', 'Por favor, selecione a sua Areninha de lotação.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: nome,
        email: email,
        senha: senha,
        tipoUsuario: 'MONITOR',
        turnoLotado: turnoSelecionado,
        areninhaId: areninhaSelecionada
      };

      await api.post('/usuarios/cadastrar', payload);
      
      Alert.alert('Sucesso', 'Conta criada com sucesso! Você já pode fazer login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Ops', 'Este e-mail já está em uso.');
      } else {
        Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/Areninha_logoteste.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeText}>Criar Conta</Text>
            <Text style={styles.welcomeSubText}>Preencha seus dados para começar</Text>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons name="account-outline" size={22} color="#00838F" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
            </View>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons name="email-outline" size={22} color="#00838F" style={styles.icon} />
              <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            </View>

            <Text style={styles.labelSection}>Areninha de Lotação:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal}>
              {areninhas.map((a) => (
                <TouchableOpacity 
                  key={a.id}
                  style={[styles.badgeItem, areninhaSelecionada === a.id && styles.badgeItemSelected]}
                  onPress={() => setAreninhaSelecionada(a.id)}
                >
                  <Text style={[styles.badgeItemText, areninhaSelecionada === a.id && styles.badgeItemTextSelected]}>
                    {a.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.labelSection}>Turno de Trabalho:</Text>
            <View style={styles.badgesContainer}>
              {turnosDisponiveis.map((t) => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.badgeItem, { flex: 1 }, turnoSelecionado === t && styles.badgeItemSelected]}
                  onPress={() => setTurnoSelecionado(t)}
                >
                  <Text style={[styles.badgeItemText, turnoSelecionado === t && styles.badgeItemTextSelected]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons name="lock-outline" size={22} color="#00838F" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Senha" secureTextEntry={!mostrarSenha} value={senha} onChangeText={setSenha} />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <MaterialCommunityIcons name={mostrarSenha ? "eye-outline" : "eye-off-outline"} size={22} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons name="lock-check-outline" size={22} color="#00838F" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry={!mostrarSenha} value={confirmarSenha} onChangeText={setConfirmarSenha} />
            </View>

            <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastro} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.cadastrarButtonText}>Finalizar Cadastro</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.voltarLoginButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.voltarLoginText}>Já tem uma conta? <Text style={{fontWeight: 'bold', color: '#00838F'}}>Faça Login</Text></Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 40 
  },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 5,
    marginTop: 20
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  card: { 
    width: '85%', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 25, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 8 
  },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  welcomeSubText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, marginTop: 5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  
  labelSection: { fontSize: 14, color: '#555', fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  scrollHorizontal: { marginBottom: 15, paddingBottom: 5 },
  badgesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  
  badgeItem: { backgroundColor: '#F0F0F0', paddingVertical: 10, paddingHorizontal: 15, marginHorizontal: 4, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#DDD' },
  badgeItemSelected: { backgroundColor: '#00838F', borderColor: '#00838F' },
  badgeItemText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  badgeItemTextSelected: { color: '#FFF' },

  cadastrarButton: { backgroundColor: '#00838F', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  cadastrarButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  voltarLoginButton: { marginTop: 20, alignItems: 'center' },
  voltarLoginText: { color: '#666', fontSize: 14 },
});