<template>
    <div>
      <h2>Teste de Conexão com o Banco de Dados</h2>
      <button @click="carregarUsuarios">Carregar Usuários</button>
  
      <!-- Exibição dos usuários recebidos -->
      <div v-if="usuarios.length > 0">
        <h3>Usuários:</h3>
        <ul>
          <li v-for="usuario in usuarios" :key="usuario.id">
            {{ usuario.nome }} - {{ usuario.email }}
          </li>
        </ul>
      </div>
  
      <!-- Mensagem de erro -->
      <div v-if="erro" class="error">
        <p>Erro ao carregar usuários: {{ erro }}</p>
      </div>
    </div>
  </template>
  
  <script>
  // Importando a instância do Axios para usuários
  import { usuarioApi } from '../Services/http.js';
  
  export default {
    data() {
      return {
        usuarios: [],  // Lista de usuários
        erro: '',  // Para exibir erros caso a requisição falhe
      };
    },
    methods: {
      // Método para carregar os usuários do backend
      async carregarUsuarios() {
        try {
          // Fazendo a requisição GET para o backend
          const response = await usuarioApi.get('/'); // A URL é a do backend que retorna os usuários
          this.usuarios = response.data; // Armazenando os usuários retornados
          console.log('Usuários carregados:', this.usuarios); // Verificando os dados no console
        } catch (error) {
          console.error('Erro ao carregar usuários:', error);
          this.erro = 'Não foi possível carregar os usuários'; // Definindo a mensagem de erro
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilo simples para a página */
  h2 {
    color: #42b983;
  }
  
  button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #366e47;
  }
  
  .error {
    color: red;
    font-size: 14px;
  }
  </style>
  