import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import HeaderApp from '../components/HeaderApp';

// Configuração para deixar o calendário em Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarioScreen() {
  // Pega a data de hoje no formato YYYY-MM-DD para marcar logo que abre
  const hoje = new Date().toISOString().split('T')[0];
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  // Um rascunho de como as aulas virão do banco de dados no futuro
  const agendaDeAulas = {
    [hoje]: [
      { id: 1, titulo: 'Treino de Finalização (6º e 7º Ano)', horario: '07:30 - 09:00', icone: 'soccer' },
      { id: 2, titulo: 'Coletivo (8º e 9º Ano)', horario: '09:00 - 10:30', icone: 'whistle' },
    ],
    '2026-03-10': [ // <- Coloque um dia diferente aqui pra testar
      { id: 3, titulo: 'Futebol Infantil', horario: '14:00 - 15:30', icone: 'soccer' },
      { id: 4, titulo: 'Oficina de Artes', horario: '15:30 - 17:00', icone: 'palette' },
    ]
  };

  // Pega as aulas do dia clicado (ou devolve um array vazio se não tiver nada)
  const aulasDoDia = agendaDeAulas[dataSelecionada] || [];

  // Função para formatar a data por extenso (Ex: Quarta, Abril 24)
  const formatarDataExtenso = (dataString) => {
    const data = new Date(dataString + 'T12:00:00'); // Força o fuso horário pro meio dia pra não dar bug de voltar 1 dia
    const opcoes = { weekday: 'long', month: 'long', day: 'numeric' };
    const formatada = data.toLocaleDateString('pt-BR', opcoes);
    // Deixa a primeira letra maiúscula
    return formatada.charAt(0).toUpperCase() + formatada.slice(1);
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        <HeaderApp showBack={true} />

        <View style={styles.content}>
          
          {/* CARD DO CALENDÁRIO */}
          <View style={styles.card}>
            <Calendar
              current={hoje}
              onDayPress={(day) => setDataSelecionada(day.dateString)}
              markedDates={{
                // Pinta os dias que têm aula com uma bolinha
                ...Object.keys(agendaDeAulas).reduce((acc, date) => {
                  acc[date] = { marked: true, dotColor: '#00838F' };
                  return acc;
                }, {}),
                // Destaca o dia que o usuário clicou
                [dataSelecionada]: { selected: true, selectedColor: '#00838F', selectedTextColor: '#FFF' }
              }}
              theme={{
                calendarBackground: 'transparent',
                textSectionTitleColor: '#666',
                selectedDayBackgroundColor: '#00838F',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#00838F',
                dayTextColor: '#333',
                textDisabledColor: '#d9e1e8',
                arrowColor: '#00838F',
                monthTextColor: '#333',
                textMonthFontWeight: 'bold',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />
          </View>

          {/* CARD DA AGENDA DO DIA */}
          <View style={styles.agendaCard}>
            <Text style={styles.agendaTitle}>{formatarDataExtenso(dataSelecionada)}</Text>
            
            {aulasDoDia.length > 0 ? (
              aulasDoDia.map((aula) => (
                <View key={aula.id} style={styles.aulaItem}>
                  <View style={styles.aulaIconeContainer}>
                    <MaterialCommunityIcons name={aula.icone} size={24} color="#00838F" />
                  </View>
                  <View style={styles.aulaInfo}>
                    <Text style={styles.aulaTitulo}>{aula.titulo}</Text>
                    <Text style={styles.aulaHorario}>
                      <MaterialCommunityIcons name="clock-outline" size={14} /> {aula.horario}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.vazioContainer}>
                <MaterialCommunityIcons name="calendar-blank" size={40} color="#CCC" />
                <Text style={styles.vazioText}>Nenhuma atividade programada para este dia.</Text>
              </View>
            )}

            <TouchableOpacity style={styles.btnAdicionar}>
              <MaterialCommunityIcons name="plus" size={20} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={styles.btnAdicionarText}>Planejar Nova Atividade</Text>
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  agendaCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  agendaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  aulaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  aulaIconeContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  aulaInfo: {
    flex: 1,
  },
  aulaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  aulaHorario: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  vazioContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  vazioText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  btnAdicionar: {
    backgroundColor: '#00838F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 10,
  },
  btnAdicionarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});