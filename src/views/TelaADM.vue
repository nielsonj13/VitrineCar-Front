<template>
  <div>
    <Navbar />
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div class="stats">
          <div class="stat-box">
            <p>Total de Usuários</p>
            <h3>{{ totalUsuarios }}</h3>
          </div>
          <div class="stat-box">
            <p>Total de Anúncios</p>
            <h3>{{ totalAnuncios }}</h3>
          </div>
        </div>
      </div>

      <div class="tables">
        <!-- Tabela de Usuários -->
        <div class="table-container">
          <h3>Usuários</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <button @click="editarUsuario(usuario.id)">Editar</button>
                  <button @click="excluirUsuario(usuario.id)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="criarUsuario">Criar Novo Usuário</button>
        </div>

        <!-- Tabela de Anúncios -->
        <div class="table-container">
          <h3>Anúncios</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Preço</th>
                <th>ID do Usuário</th> <!-- Coluna ID do Usuário -->
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="anuncio in anuncios" :key="anuncio.id">
                <td>{{ anuncio.id }}</td>
                <td>{{ anuncio.marca }}</td>
                <td>{{ anuncio.modelo }}</td>
                <td>R$ {{ anuncio.preco }}</td>
                <td>{{ anuncio.usuario.id }}</td> <!-- Exibe o ID do Usuário -->
                <td>
                  <button @click="editarAnuncio(anuncio.id)">Editar</button>
                  <button @click="excluirAnuncio(anuncio.id)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="criarAnuncio">Criar Novo Anúncio</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi, anuncioApi } from "../Services/http.js"; // Instâncias do Axios configuradas

export default {
  name: "TelaAdmin",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarios: [],   // Lista de usuários
      anuncios: [],   // Lista de anúncios
      totalUsuarios: 0, // Contador total de usuários
      totalAnuncios: 0, // Contador total de anúncios
    };
  },
  created() {
    this.carregarDados();
  },
  methods: {
    // Método para carregar dados iniciais
    async carregarDados() {
      try {
        // Carregar usuários
        const usuariosResponse = await usuarioApi.get('');
        this.usuarios = usuariosResponse.data;
        this.totalUsuarios = this.usuarios.length;

        // Carregar anúncios
        const anunciosResponse = await anuncioApi.get('');
        this.anuncios = anunciosResponse.data;
        this.totalAnuncios = this.anuncios.length;
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },
    
    // Métodos CRUD de Anúncios
    async criarAnuncio() {
      this.$router.push({ name: "TelaCriarAnuncios" });
    },

    async editarAnuncio(id) {
      this.$router.push({ name: "TelaEditarAnuncios", params: { id } });
    },

    async excluirAnuncio(id) {
      try {
        await anuncioApi.delete(`/${id}`);
        this.carregarDados(); // Recarrega os dados após a exclusão
      } catch (error) {
        console.error("Erro ao excluir o anúncio:", error);
      }
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  padding: 40px;
  background-color: #f4f6f9;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  width: 150px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-box:hover {
  transform: scale(1.05);
}

.stat-box h3 {
  color: #5b3199;
  font-size: 32px;
}

.stat-box p {
  color: #888;
  font-size: 14px;
}

.tables {
  margin-top: 40px;
}

.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

table th {
  background-color: #f4f6f9;
  color: #5b3199;
}

table td {
  background-color: #fff;
}

button {
  padding: 10px 20px;
  background-color: #5b3199;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4a1c6e;
}

.btn-add {
  background-color: #28a745;
  margin-top: 20px;
  text-align: center;
  padding: 10px 20px;
}

.btn-add:hover {
  background-color: #218838;
}

table tr td button {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .stat-box {
    width: 120px;
  }
}
</style>