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
        <button :class="{ active: abaAtiva === 'novoADM'}" @click="abaAtiva = 'novoADM'">Criar ADM</button>
        <button :class="{ active: abaAtiva === 'denuncias'}" @click="abaAtiva = 'denuncias'">Denuncias</button>
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

        <!-- Formulário para Criar Novo Administrador -->
        <div v-show="abaAtiva === 'novoADM'" class="form-admin-wrapper">
          <h3 class="mb-4">Criar Novo Administrador</h3>

          <div v-if="mensagemFeedback" :class="['alert', sucesso ? 'alert-success' : 'alert-danger']">
            {{ mensagemFeedback }}
          </div>

          <form @submit.prevent="criarAdmin" class="form-admin">
            <div class="mb-3">
              <label for="nome" class="form-label">Nome</label>
              <input type="text" v-model="novoAdmin.nome" class="form-control" id="nome" placeholder="Digite o nome completo" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" v-model="novoAdmin.email" class="form-control" id="email" placeholder="exemplo@email.com" required />
            </div>
            <div class="mb-3">
              <label for="senha" class="form-label">Senha</label>
              <input type="password" v-model="novoAdmin.senha" class="form-control" id="senha" placeholder="Senha segura" required />
            </div>

            <button type="submit" class="btn btn-success w-100">
              <i class="bi bi-person-plus-fill me-2"></i> Criar Administrador
            </button>
          </form>
        </div>

        <!-- Tabela de Denúncias -->
        <div v-show="abaAtiva === 'denuncias'" class="table-container">
          <h3>Denúncias</h3>
          <input type="text" v-model="buscaDenuncia" placeholder="Buscar por nome, email ou motivo..." class="input-busca" />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Motivo</th>
                <th>Anúncio</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="denuncia in denunciasFiltradas" :key="denuncia.id">
                <td>{{ denuncia.id }}</td>
                <td>{{ denuncia.nome }}</td>
                <td>{{ denuncia.email }}</td>
                <td>{{ denuncia.motivo }}</td>
                <td>#{{ denuncia.anuncio?.id }} - {{ denuncia.anuncio?.modelo }}</td>
                <td>
                  <button class="btn-ver" @click="verAnuncio(denuncia.anuncio)">Ver Anúncio</button>
                  <button class="btn-excluir" @click="confirmarExclusaoDenuncia(denuncia.id)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>

          <button v-if="denunciasFiltradas.length < denuncias.length" @click="verMaisDenuncias" class="btn-ver-mais">
            Ver mais denúncias
          </button>

          <button v-if="limiteDenuncias > 10" @click="verMenosDenuncias" class="btn-ver-mais">
            Ver menos denúncias
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi, anuncioApi, denunciaApi } from "../Services/http.js";

export default {
  name: "TelaAdmin",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarios: [],
      anuncios: [],
      denuncias: [],
      totalUsuarios: 0,
      totalAnuncios: 0,
      abaAtiva: 'usuarios',
      buscaUsuario: '',
      buscaAnuncio: '',
      buscaDenuncia: "",
      limiteUsuarios: 10, 
      limiteAnuncios: 10,
      limiteDenuncias: 10,
      novoAdmin: {
        nome: '',
        email: '',
        senha: ''
      },
      mensagemFeedback: "",
      sucesso: false,
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
    denunciasFiltradas() {
      return this.denuncias
        .filter(d => d.nome.toLowerCase().includes(this.buscaDenuncia.toLowerCase()) ||
                    d.email.toLowerCase().includes(this.buscaDenuncia.toLowerCase()) ||
                    d.motivo.toLowerCase().includes(this.buscaDenuncia.toLowerCase()))
        .slice(0, this.limiteDenuncias);
    }
  },
  mounted() {
    this.verificarAcessoAdmin();
  },
  created() {
    this.carregarDados();
  },
  methods: {
    async criarAdmin() {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return;

      if (!this.novoAdmin.nome || !this.novoAdmin.email || !this.novoAdmin.senha) {
        this.sucesso = false;
        this.mensagemFeedback = "Preencha todos os campos.";
        return;
      }

      try {
        await usuarioApi.post("/admin-criar", this.novoAdmin, {
          headers: { Authorization: `Basic ${authToken}` }
        });

        this.sucesso = true;
        this.mensagemFeedback = "Administrador criado com sucesso!";
        this.novoAdmin = { nome: '', email: '', senha: '' };
        this.carregarDados(); // atualiza a lista
        setTimeout(() => this.mensagemFeedback = "", 5000);
      } catch (error) {
        this.sucesso = false;
        this.mensagemFeedback = "Erro ao criar administrador. Verifique se o e-mail já existe.";
        setTimeout(() => this.mensagemFeedback = "", 5000);
      }
    },

    async verificarAcessoAdmin() {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        sessionStorage.setItem("mensagemAlerta", "Você precisa estar logado para acessar a área administrativa.");
        this.$router.push({ name: "TelaLogin" });
        return;
      }

      try {
        const response = await usuarioApi.get("/logado", {
          headers: { Authorization: `Basic ${authToken}` }
        });

        const usuario = response.data;

        if (usuario.role !== "ADMIN") {
          sessionStorage.setItem("mensagemAlerta", "Acesso restrito à administração.");
          this.$router.push({ name: "TelaPrincipal" }); // Redireciona para a tela de bloqueios
        }
      } catch (error) {
        console.error("Erro ao verificar acesso admin:", error);
        sessionStorage.setItem("mensagemAlerta", "Erro ao verificar permissão.");
        this.$router.push({ name: "TelaPrincipal" });
      }
    },

    async carregarDados() {
      try {
        const usuariosResponse = await usuarioApi.get('');
        this.usuarios = usuariosResponse.data;
        this.totalUsuarios = this.usuarios.length;

        const anunciosResponse = await anuncioApi.get('');
        this.anuncios = anunciosResponse.data;
        this.totalAnuncios = this.anuncios.length;

        const denunciasResponse = await denunciaApi.get('');
        this.denuncias = denunciasResponse.data;
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
    verMaisDenuncias() {
      this.limiteDenuncias += 10;
    },
    verMenosDenuncias() {
      this.limiteDenuncias = 10;
    },

    async confirmarExclusaoUsuario(id) {
      const confirmacao = window.confirm('Tem certeza que deseja excluir este usuário? Ao excluir o usuário todos os dados vinculados a ele serão excluidos juntos.');
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

    confirmarExclusaoDenuncia(id) {
      if (confirm("Tem certeza que deseja excluir esta denúncia?")) {
        this.excluirDenuncia(id);
      }
    },

    async editarUsuario(id) {
      this.$router.push({ name: "TelaEditarUsuario", params: { id } });
    },

    async excluirUsuario(id) {
      try {
        // Filtra os anúncios que pertencem ao usuário
        const anunciosDoUsuario = this.anuncios.filter(anuncio => anuncio.usuario.id === id);

        // Exclui cada anúncio
        for (const anuncio of anunciosDoUsuario) {
          await anuncioApi.delete(`/${anuncio.id}`);
        }

        // Agora exclui o usuário
        await usuarioApi.delete(`/${id}`);

        alert("Usuário e seus anúncios excluídos com sucesso.");
        this.carregarDados();
      } catch (error) {
        console.error("Erro ao excluir o usuário e seus anúncios:", error);
        alert("Erro ao excluir o usuário. Verifique se há anúncios vinculados.");
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

    async excluirDenuncia(id) {
      try {
        await denunciaApi.delete(`/${id}`);
        this.denuncias = this.denuncias.filter(d => d.id !== id);
        alert("Denúncia excluída com sucesso.");
      } catch (e) {
        alert("Erro ao excluir denúncia.");
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
/* Estilo geral do card de criação de admin */
.form-admin-wrapper {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px 25px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-left: 6px solid #4a1c6e;
  transition: all 0.3s ease-in-out;
}

/* Estilo do título */
.form-admin-wrapper h3 {
  text-align: center;
  color: #333;
  font-weight: 600;
  margin-bottom: 25px;
}

/* Campos do formulário */
.form-admin .form-control {
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.95rem;
  border: 1px solid #ced4da;
  transition: border-color 0.2s;
}

.form-admin .form-control:focus {
  border-color: #4a1c6e;
  box-shadow: 0 0 0 0.15rem rgba(40, 167, 69, 0.25);
}

/* Botão estilizado */
.form-admin .btn-success {
  padding: 10px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  background-color: #4a1c6e;
  border: none;
  transition: background-color 0.3s;
}

.form-admin .btn-success:hover {
  background-color: #4a1c6e;
}

/* Mensagens de alerta */
.alert {
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.95rem;
  margin-bottom: 20px;
  text-align: center;
}

/* Suaviza a exibição */
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .stat-box {
    width: 120px;
  }
}
</style>
