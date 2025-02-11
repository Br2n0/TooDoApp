import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import { TodoContext } from './TodoContext';
import Animated, { Easing, withSpring } from 'react-native-reanimated';

const HomeScreen = () => {
  const { tarefas, adicionarTarefa, alternarConclusao, removerTarefa } = useContext(TodoContext);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('todos'); // Filtro de exibição das tarefas

  const handleAdd = () => {
    if (texto.trim()) {
      adicionarTarefa(texto);
      setTexto('');
    }
  };

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === 'todos') return true;
    if (filtro === 'concluídas') return tarefa.concluida;
    if (filtro === 'pendentes') return !tarefa.concluida;
  });

  const animarConclusao = (id) => {
    const animacao = withSpring(1, { damping: 2, stiffness: 100 }); // Adiciona animação de transição
    alternarConclusao(id);
    return animacao;
  };

  return (
    <View style={styles.container}>
      {/* Barra de filtros */}
      <View style={styles.filtroContainer}>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'todos' && styles.filtroAtivo]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={styles.filtroTexto}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'concluídas' && styles.filtroAtivo]}
          onPress={() => setFiltro('concluídas')}
        >
          <Text style={styles.filtroTexto}>Concluídas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'pendentes' && styles.filtroAtivo]}
          onPress={() => setFiltro('pendentes')}
        >
          <Text style={styles.filtroTexto}>Pendentes</Text>
        </TouchableOpacity>
      </View>

      {/* Input e botão de adicionar tarefa */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua tarefa..."
          onChangeText={setTexto}
          value={texto}
        />
        <TouchableOpacity style={styles.botao} onPress={handleAdd}>
          <Text style={styles.botaoTexto}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tarefas */}
      <FlatList
        data={tarefasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => animarConclusao(item.id)}>
              <Animated.Text
                style={[
                  styles.itemTexto,
                  item.concluida && styles.concluida,
                  { transform: [{ scale: withSpring(item.concluida ? 1.2 : 1) }] }, // Animação de conclusão
                ]}
              >
                {item.texto}
              </Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerTarefa(item.id)}>
              <Text style={styles.remover}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  botao: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 5,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemTexto: { fontSize: 16 },
  concluida: { textDecorationLine: 'line-through', color: '#888' },
  remover: { color: 'red', fontWeight: 'bold', marginLeft: 10 },
  filtroContainer: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-around' },
  filtroBotao: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  filtroAtivo: { backgroundColor: '#007BFF' },
  filtroTexto: { color: '#333' },
});

export default HomeScreen;
