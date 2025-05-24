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

      <!-- Controle de Abas -->
      <div class="tabs">
        <button :class="{ active: abaAtiva === 'usuarios' }" @click="abaAtiva = 'usuarios'">Usuários</button>
        <button :class="{ active: abaAtiva === 'anuncios' }" @click="abaAtiva = 'anuncios'">Anúncios</button>
      </div>

      <div class="tables">
        <!-- Tabela de Usuários -->
        <div v-show="abaAtiva === 'usuarios'" class="table-container">
          <h3>Usuários</h3>
          <input type="text" v-model="buscaUsuario" placeholder="Buscar por nome ou email..." class="input-busca" />

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
              <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <button class="btn-editar" @click="editarUsuario(usuario.id)">Editar</button>
                  <button  class="btn-excluir" @click="confirmarExclusaoUsuario(usuario.id)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button v-if="usuariosFiltrados.length < usuarios.length" @click="verMaisUsuarios" class="btn-ver-mais">
            Ver mais usuários
          </button>
          <button v-if="limiteUsuarios > 10" @click="verMenosUsuarios" class="btn-ver-mais">
            Ver menos usuários
          </button>
        </div>

        <!-- Tabela de Anúncios -->
        <div v-show="abaAtiva === 'anuncios'" class="table-container">
          <h3>Anúncios</h3>
          <input type="text" v-model="buscaAnuncio" placeholder="Buscar por marca ou modelo..." class="input-busca" />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Preço</th>
                <th>ID do Usuário</th>
                <th>Nome do Usuário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="anuncio in anunciosFiltrados" :key="anuncio.id">
                <td>{{ anuncio.id }}</td>
                <td>{{ anuncio.marca }}</td>
                <td>{{ anuncio.modelo }}</td>
                <td>R$ {{ anuncio.preco }}</td>
                <td>{{ anuncio.usuario.id }}</td>
                <td>{{ anuncio.usuario.nome }}</td>
                <td>
                   <button class="btn-ver" @click="verAnuncio(anuncio)">Ver anúncio</button>
                  <button class="btn-editar" @click="editarAnuncio(anuncio.id)">Editar</button>
                  <button  class="btn-excluir" @click="confirmarExclusaoAnuncio(anuncio.id)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>

          <button v-if="anunciosFiltrados.length < anuncios.length" @click="verMaisAnuncios" class="btn-ver-mais">
            Ver mais anúncios
          </button>

          <button v-if="limiteAnuncios > 10" @click="verMenosAnuncios" class="btn-ver-mais">
          Ver menos anúncios
        </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi, anuncioApi } from "../Services/http.js";

export default {
  name: "TelaAdmin",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarios: [],
      anuncios: [],
      totalUsuarios: 0,
      totalAnuncios: 0,
      abaAtiva: 'usuarios',
      buscaUsuario: '',
      buscaAnuncio: '',
       limiteUsuarios: 10, 
      limiteAnuncios: 10,
    };
  },
  computed: {
    usuariosFiltrados() {
      const termo = this.buscaUsuario.toLowerCase();
      return this.usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo)
      ).slice(0, this.limiteUsuarios);
    },
    anunciosFiltrados() {
      const termo = this.buscaAnuncio.toLowerCase();
      return this.anuncios.filter(anuncio =>
        anuncio.marca.toLowerCase().includes(termo) ||
        anuncio.modelo.toLowerCase().includes(termo)
      ).slice(0, this.limiteAnuncios);
    },
  },
  created() {
    this.carregarDados();
  },
  methods: {
    async carregarDados() {
      try {
        const usuariosResponse = await usuarioApi.get('');
        this.usuarios = usuariosResponse.data;
        this.totalUsuarios = this.usuarios.length;

        const anunciosResponse = await anuncioApi.get('');
        this.anuncios = anunciosResponse.data;
        this.totalAnuncios = this.anuncios.length;
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },

    verMaisUsuarios() {
      this.limiteUsuarios += 10;
    },
    verMenosUsuarios() {
      this.limiteUsuarios = Math.max(10, this.limiteUsuarios - 10);
    },
    verMaisAnuncios() {
      this.limiteAnuncios += 10;
    },
    verMenosAnuncios() {
      this.limiteAnuncios = Math.max(10, this.limiteAnuncios - 10);
    },

    async confirmarExclusaoUsuario(id) {
      const confirmacao = window.confirm('Tem certeza que deseja excluir este usuário?');
      if (confirmacao) {
        this.excluirUsuario(id);
      }
    },
    
    async confirmarExclusaoAnuncio(id) {
      const confirmacao = window.confirm('Tem certeza que deseja excluir este anúncio?');
      if (confirmacao) {
        this.excluirAnuncio(id);
      }
    },

    async editarUsuario(id) {
      this.$router.push({ name: "TelaEditarUsuario", params: { id } });
    },

    async excluirUsuario(id) {
      try {
        await usuarioApi.delete(`/${id}`);
        this.carregarDados();
      } catch (error) {
        console.error("Erro ao excluir o usuário:", error);
      }
    },

    async editarAnuncio(id) {
      this.$router.push({ name: "TelaEditarAnuncios", params: { id } });
    },

    async excluirAnuncio(id) {
      try {
        await anuncioApi.delete(`/${id}`);
        this.carregarDados();
      } catch (error) {
        console.error("Erro ao excluir o anúncio:", error);
      }
    },
    verAnuncio(anuncio) {
      // Passando os dados do anúncio para a TelaVeiculo
      this.$router.push({ 
        name: "TelaVeiculo", 
        params: { id: anuncio.id, usuarioId: this.usuarioId }
      });  // Redireciona para a TelaVeiculo com os parâmetros necessários
    },
  },
};
</script>

<style scoped>
/* Estilo da busca */
.input-busca {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.admin-dashboard {
  padding: 40px;
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

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tabs button.active {
  background-color: #5b3199;
  color: white;
}

.tables {
  margin-top: 20px;
}

.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
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
}

.btn-add:hover {
  background-color: #218838;
}

.btn-excluir {
  background-color: #dc3545;
}

.btn-excluir:hover {
  background-color: #c82333;
}

.btn-editar {
  background-color: #ffc107;
  color: #212529; /* texto escuro para melhor contraste */
}

.btn-editar:hover {
  background-color: #e0a800;
}

.btn-ver-mais {
  margin-top: 15px;
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
