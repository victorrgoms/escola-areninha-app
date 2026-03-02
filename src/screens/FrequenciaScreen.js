import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, ScrollView, Platform, Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker'; // <-- Importação nova
import api from '../services/api';
import HeaderApp from '../components/HeaderApp';

export default function FrequenciaScreen() {
  const [dataAula, setDataAula] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [atividade, setAtividade] = useState('');
  const [turmasSelecionadas, setTurmasSelecionadas] = useState([]);
  
  const [turnoSelecionado, setTurnoSelecionado] = useState('Manhã');
  const [turnoTravado, setTurnoTravado] = useState(false);

  const [frequencias, setFrequencias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  // State novo para a imagem da assinatura
  const [assinaturaBase64, setAssinaturaBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const turmasDisponiveis = ['6º Ano', '7º Ano', '8º Ano', '9º Ano'];
  const turnosDisponiveis = ['Manhã', 'Tarde'];

  useEffect(() => {
    async function buscarPerfil() {
      try {
        const response = await api.get('/usuarios/me');
        const turnoLotado = response.data.turnoLotado; 
        
        if (turnoLotado === 'Manhã' || turnoLotado === 'Tarde') {
          setTurnoSelecionado(turnoLotado);
          setTurnoTravado(true);
        } else {
          setTurnoTravado(false);
        }
      } catch (error) {
        console.log("Erro ao buscar perfil do usuário. Usando padrão liberado.");
      }
    }
    buscarPerfil();
  }, []);

  const formatarData = (data) => {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const getMesAtual = () => {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${meses[new Date().getMonth()]} ${new Date().getFullYear()}`;
  }

  const onChangeData = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDataAula(selectedDate);
    }
  };

  const toggleTurma = (turma) => {
    if (turmasSelecionadas.includes(turma)) {
      setTurmasSelecionadas(turmasSelecionadas.filter(t => t !== turma));
    } else {
      setTurmasSelecionadas([...turmasSelecionadas, turma]);
    }
  };

  const limparFormulario = () => {
    setDataAula(new Date());
    setAtividade('');
    setTurmasSelecionadas([]);
    setEditandoId(null);
  };

  const salvarFrequencia = () => {
    if (turmasSelecionadas.length === 0 || !atividade) {
      Alert.alert('Atenção', 'Preencha a atividade e selecione pelo menos uma turma.');
      return;
    }

    const turmasStr = turmasSelecionadas.join(', ');
    const atividadeFormatada = `${atividade} - ${turmasStr}`;

    const novaFreq = {
      id: editandoId || Date.now().toString(),
      data: formatarData(dataAula),
      turno: turnoSelecionado,
      turma: turmasStr,
      atividade: atividadeFormatada,
      alunosPresentes: 0,
      areninhaId: 1
    };

    if (editandoId) {
      setFrequencias(frequencias.map(f => f.id === editandoId ? novaFreq : f));
    } else {
      setFrequencias([...frequencias, novaFreq]);
    }

    limparFormulario();
  };

  const editarFrequencia = (item) => {
    const [dia, mes, ano] = item.data.split('/');
    setDataAula(new Date(ano, mes - 1, dia));
    const atividadeBase = item.atividade.split(' - ')[0];
    setAtividade(atividadeBase);
    setTurmasSelecionadas(item.turma.split(', '));
    setTurnoSelecionado(item.turno);
    setEditandoId(item.id);
  };

  const excluirFrequencia = (id) => {
    Alert.alert('Excluir', 'Tem certeza que quer remover essa aula da lista?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sim, remover', onPress: () => setFrequencias(frequencias.filter(f => f.id !== id)) }
    ]);
  };

  const calcularTotaisPorTurma = () => {
    const contagem = { '6º Ano': 0, '7º Ano': 0, '8º Ano': 0, '9º Ano': 0 };
    frequencias.forEach(freq => {
      const turmasDestaAula = freq.turma.split(', ');
      turmasDestaAula.forEach(t => {
        if (contagem[t] !== undefined) {
          contagem[t] += 1;
        }
      });
    });
    return contagem;
  };

  const totaisCalculados = calcularTotaisPorTurma();

  // Função nova para pegar a imagem da galeria
  const selecionarAssinatura = async () => {
    // Pede permissão se for a primeira vez
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ops', 'Precisamos de permissão para acessar suas fotos e pegar a assinatura.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 1], // formato de assinatura
      quality: 0.7,
      base64: true, // ja converte a imagem pra base64
    });

    if (!result.canceled) {
      setAssinaturaBase64(result.assets[0].base64);
    }
  };

  const gerarPDF = async () => {
    if (frequencias.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos uma aula na lista para gerar o relatório.');
      return;
    }

    // Trava a geração se o cara esquecer de botar a assinatura
    if (!assinaturaBase64) {
      Alert.alert('Atenção', 'Por favor, anexe a imagem da sua assinatura para gerar o relatório final.');
      return;
    }

    setLoading(true);

    try {
      const payloadWrapper = {
        frequencias: frequencias,
        totais: totaisCalculados,
        assinaturaBase64: assinaturaBase64, // Mandamos a assinatura pro backend
      };

      const response = await api.post('/frequencias/relatorio', payloadWrapper, {
        responseType: 'blob' 
      });

      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const fileUri = `${FileSystem.documentDirectory}Relatorio_Areninha.pdf`;

        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: 'base64',
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartilhar Relatório Mensal',
          });
        }
        
        setLoading(false);
      };

    } catch (error) {
      if (error.response && error.response.status === 403) {
        Alert.alert('Acesso Negado', 'Seu usuário atual não tem permissão para gerar este relatório.');
      } else {
        Alert.alert('Erro', 'Não foi possível gerar o relatório. Verifique o servidor.');
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        <HeaderApp 
          showBack={true} 
          title="Registrar Frequência" 
          subtitle={`Frequência mensal - ${getMesAtual()}`} 
        />

        <View style={styles.cardForm}>
          <Text style={styles.sectionTitle}>{editandoId ? 'Editando Aula' : 'Nova Aula'}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data da Aula</Text>
            <TouchableOpacity style={styles.inputBox} onPress={() => setShowDatePicker(true)}>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" style={styles.icon} />
              <Text style={styles.dateText}>{formatarData(dataAula)}</Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={dataAula}
                mode="date"
                display="default"
                onChange={onChangeData}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Turno {turnoTravado && '(Travado no seu cadastro)'}</Text>
            <View style={styles.badgesContainer}>
              {turnosDisponiveis.map((t) => {
                const selecionado = turnoSelecionado === t;
                const bloqueado = turnoTravado && !selecionado;
                return (
                  <TouchableOpacity 
                    key={t}
                    disabled={bloqueado}
                    style={[
                      styles.badge, 
                      selecionado && styles.badgeSelected,
                      bloqueado && styles.badgeDisabled
                    ]}
                    onPress={() => setTurnoSelecionado(t)}
                  >
                    <Text style={[
                      styles.badgeText, 
                      selecionado && styles.badgeTextSelected,
                      bloqueado && styles.badgeTextDisabled
                    ]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Turmas Atendidas</Text>
            <View style={styles.badgesContainer}>
              {turmasDisponiveis.map((t) => {
                const selecionado = turmasSelecionadas.includes(t);
                return (
                  <TouchableOpacity 
                    key={t}
                    style={[styles.badge, selecionado && styles.badgeSelected]}
                    onPress={() => toggleTurma(t)}
                  >
                    <Text style={[styles.badgeText, selecionado && styles.badgeTextSelected]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Atividade Realizada</Text>
            <View style={styles.inputBoxTextArea}>
              <TextInput
                style={styles.textArea}
                placeholder="Ex: Treino de finalização..."
                multiline={true}
                numberOfLines={3}
                value={atividade}
                onChangeText={setAtividade}
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            {editandoId && (
              <TouchableOpacity style={styles.cancelButton} onPress={limparFormulario}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.addButton} onPress={salvarFrequencia}>
              <MaterialCommunityIcons name={editandoId ? "check" : "plus"} size={20} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={styles.addButtonText}>{editandoId ? 'Salvar Edição' : 'Adicionar Frequência'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {frequencias.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Aulas Registradas ({frequencias.length})</Text>
            
            {frequencias.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={styles.listContent}>
                  <Text style={styles.listDate}>{item.data} - {item.turno}</Text>
                  <Text style={styles.listActivity} numberOfLines={2}>{item.atividade}</Text>
                </View>
                
                <View style={styles.listActions}>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => editarFrequencia(item)}>
                    <MaterialCommunityIcons name="pencil-outline" size={22} color="#00838F" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => excluirFrequencia(item.id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Aulas por Turma neste Mês:</Text>
              <View style={styles.summaryGrid}>
                {Object.entries(totaisCalculados).map(([turma, qtd]) => (
                  <View key={turma} style={styles.summaryItem}>
                    <Text style={styles.summaryTurma}>{turma}</Text>
                    <Text style={styles.summaryQtd}>{qtd} aulas</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* SEÇÃO DA ASSINATURA */}
            <View style={styles.assinaturaContainer}>
              <Text style={styles.sectionTitle}>Assinatura do Monitor</Text>
              
              {assinaturaBase64 ? (
                <View style={styles.assinaturaPreviewBox}>
                  <Image 
                    source={{ uri: `data:image/png;base64,${assinaturaBase64}` }} 
                    style={styles.assinaturaImage} 
                    resizeMode="contain" 
                  />
                  <TouchableOpacity style={styles.removerAssinaturaBtn} onPress={() => setAssinaturaBase64(null)}>
                    <MaterialCommunityIcons name="close-circle" size={24} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.assinaturaUploadBtn} onPress={selecionarAssinatura}>
                  <MaterialCommunityIcons name="draw-pen" size={26} color="#00838F" />
                  <Text style={styles.assinaturaUploadText}>Anexar Imagem da Assinatura</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.generateButton} onPress={gerarPDF} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <MaterialCommunityIcons name="file-pdf-box" size={24} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.generateButtonText}>Gerar Relatório Final</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  cardForm: {
    backgroundColor: '#FFF', padding: 20, borderRadius: 15, width: '90%', alignSelf: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    marginBottom: 20, marginTop: -20, 
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9',
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 15, height: 50,
  },
  dateText: { fontSize: 16, color: '#333' },
  
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { backgroundColor: '#F0F0F0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#DDD' },
  badgeSelected: { backgroundColor: '#00838F', borderColor: '#00838F' },
  badgeDisabled: { backgroundColor: '#E0E0E0', borderColor: '#CCC', opacity: 0.6 },
  badgeText: { color: '#666', fontWeight: 'bold' },
  badgeTextSelected: { color: '#FFF' },
  badgeTextDisabled: { color: '#999' },

  inputBoxTextArea: {
    backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#E0E0E0', 
    borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, minHeight: 80,
  },
  icon: { marginRight: 10 },
  textArea: { flex: 1, fontSize: 16, color: '#333', textAlignVertical: 'top' },
  
  actionRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  addButton: {
    backgroundColor: '#00838F', paddingHorizontal: 20, height: 45, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  cancelButton: { justifyContent: 'center', marginRight: 15 },
  cancelButtonText: { color: '#999', fontWeight: 'bold', fontSize: 15 },

  listContainer: { marginTop: 10, width: '90%', alignSelf: 'center' },
  listItem: {
    flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12,
    marginBottom: 10, alignItems: 'center', justifyContent: 'space-between',
    borderLeftWidth: 4, borderLeftColor: '#00838F',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  listContent: { flex: 1, paddingRight: 10 },
  listDate: { fontSize: 12, color: '#888', fontWeight: 'bold', marginBottom: 2 },
  listActivity: { fontSize: 14, color: '#333' },
  listActions: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 5, backgroundColor: '#F5F5F5', borderRadius: 8 },

  summaryBox: {
    backgroundColor: '#E0F7FA', padding: 15, borderRadius: 10, marginTop: 15,
    borderWidth: 1, borderColor: '#B2EBF2'
  },
  summaryTitle: { fontSize: 14, fontWeight: 'bold', color: '#006064', marginBottom: 10 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryItem: { width: '48%', backgroundColor: '#FFF', padding: 10, borderRadius: 8, marginBottom: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 },
  summaryTurma: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  summaryQtd: { fontSize: 16, color: '#00838F', fontWeight: '900', marginTop: 2 },

  // Estilos da nova seção de Assinatura
  assinaturaContainer: {
    marginTop: 25,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  assinaturaUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#00838F',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 20,
  },
  assinaturaUploadText: {
    color: '#00838F',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  assinaturaPreviewBox: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  assinaturaImage: {
    width: '100%',
    height: 80, // Mantém a proporção esticadinha
  },
  removerAssinaturaBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  generateButton: {
    backgroundColor: '#2E7D32', height: 55, borderRadius: 12, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', marginTop: 20,
    shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  generateButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});