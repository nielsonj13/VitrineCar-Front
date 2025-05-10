<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <h2>Editar Usuário</h2>

        <!-- Formulário de busca pelo ID -->
        <div class="form-group">
          <label for="usuarioId">Informe o ID do Usuário:</label>
          <input type="number" id="usuarioId" v-model="usuarioId" placeholder="ID do Usuário" required />
          <button @click="buscarUsuario" class="btn-submit">Buscar Usuário</button>
        </div>

        <!-- Formulário de edição do usuário -->
        <form v-if="usuarioIdInformado" @submit.prevent="editarUsuario">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input type="text" id="nome" v-model="usuario.nome" placeholder="Nome do Usuário" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="usuario.email" placeholder="Email do Usuário" required />
          </div>

          <button type="submit" class="btn-submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi } from "../Services/http.js"; // Instância Axios configurada

export default {
  name: "TelaEditarUsuario",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarioId: "",  // Armazena o ID informado pelo administrador
      usuarioIdInformado: false, // Controle de exibição do formulário
      usuario: {
        nome: "",
        email: "",
        papel: "usuario",  // Valor padrão de papel
      },
    };
  },
  methods: {
    // Método para buscar o usuário pelo ID
    async buscarUsuario() {
      if (!this.usuarioId) {
        alert("Por favor, informe o ID do usuário.");
        return;
      }

      try {
        // Faz a requisição GET para buscar o usuário
        const response = await usuarioApi.get(`/${this.usuarioId}`);
        this.usuario = response.data;  // Preenche o formulário com os dados do usuário
        this.usuarioIdInformado = true; // Exibe o formulário de edição
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
        alert("Usuário não encontrado ou erro ao buscar dados.");
      }
    },

    // Método para editar o usuário
    async editarUsuario() {
      try {
        // Faz a requisição PUT para atualizar o usuário
        const response = await usuarioApi.put(`/${this.usuarioId}`, this.usuario);
        alert("Usuário editado com sucesso!");
        this.$router.push({ name: "TelaADM" }); // Redireciona para o Dashboard de Admin
      } catch (error) {
        console.error("Erro ao editar o usuário:", error);
        alert("Erro ao editar o usuário. Tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 60%;
  margin: 0 auto;
  padding: 20px 0;
}

.content {
  text-align: center;
}

h2 {
  color: #5b3199;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input, select {
  padding: 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  padding: 12px 20px;
  background-color: #5b3199;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4a1c6e;
}
</style>
