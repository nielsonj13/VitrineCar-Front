<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <h2>Criar Novo Usuário</h2>
        
        <!-- Formulário de Criação de Usuário -->
        <form @submit.prevent="criarUsuario">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input type="text" id="nome" v-model="usuario.nome" placeholder="Nome do Usuário" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="usuario.email" placeholder="Email do Usuário" required />
          </div>

          <div class="form-group">
            <label for="senha">Senha</label>
            <input type="password" id="senha" v-model="usuario.senha" placeholder="Senha" required />
          </div>

          <button type="submit" class="btn-submit">Criar Usuário</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi } from "../Services/http.js"; // Instância Axios configurada

export default {
  name: "TelaCriarUsuario",
  components: {
    Navbar,
  },
  data() {
    return {
      usuario: {
        nome: "",
        email: "",
        senha: "",
        papel: "usuario",  // Valor padrão de papel
      },
    };
  },
  methods: {
    async criarUsuario() {
      try {
        // Faz a requisição POST para criar o usuário
        const response = await usuarioApi.post('', this.usuario);
        alert("Usuário criado com sucesso!");
        this.$router.push({ name: "TelaADM" }); // Redireciona para o Dashboard do Admin
      } catch (error) {
        console.error("Erro ao criar o usuário:", error);
        alert("Erro ao criar o usuário. Tente novamente.");
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
