<template>
  <div>
    <Navbar />
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-image">
          <img src="/logos/imagem_login.png" alt="VitrineCar" />
        </div>

        <div class="login-form">
          <img src="/logos/logo_vitrinecar.png" alt="Logo" class="logo" />
          <h2>Acesse o Gerenciamento</h2>

          <div class="form-group">
            <label for="usuarioId">ID do Usuário:</label>
            <input
              v-model="usuarioId"
              type="number"
              id="usuarioId"
              placeholder="Digite o ID do usuário"
              required
            />
          </div>

          <div class="form-actions">
            <button @click="buscarUsuario" class="btn-action buscar">Entrar</button>
            <button @click="redirecionarParaCriar" class="btn-action criar">Criar Usuário</button>
          </div>

          <div v-if="usuarioBuscado">
            <h3>Usuário Encontrado:</h3>
            <p><strong>Nome:</strong> {{ usuarioBuscado.nome }}</p>
            <p><strong>Email:</strong> {{ usuarioBuscado.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi } from "../Services/http.js"; // API configurada para usuários

export default {
  name: "TelaLogin", // Alterado o nome para representar melhor a tela de login
  components: {
    Navbar,
  },
  data() {
    return {
      usuarioId: "", // Armazena o ID do usuário inserido no login
      usuarioBuscado: null, // Armazena os dados do usuário encontrado
    };
  },
  methods: {
    async buscarUsuario() {
      // Verifica se o ID do usuário foi preenchido
      if (!this.usuarioId) {
        alert("Digite o ID do usuário para entrar.");
        return;
      }

      try {
        // Faz a requisição para a API para buscar o usuário
        const response = await usuarioApi.get(`/usuarios/${this.usuarioId}`); // Corrigimos o endpoint para /usuarios/{id}
        
        if (response.data) {
          this.usuarioBuscado = response.data; // Armazena os dados do usuário encontrado
          alert("Login bem-sucedido!"); // Exibe mensagem de sucesso
          // Redireciona o usuário para a página principal após o login bem-sucedido
          this.$router.push({ name: "TelaDashboard" }); // Troque para o nome correto da sua tela
        } else {
          alert("Usuário não encontrado.");
          this.usuarioBuscado = null; // Reseta os dados do usuário encontrado
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Usuário não encontrado."); // Exibe mensagem de erro
        this.usuarioBuscado = null; // Reseta os dados do usuário encontrado
      }
    },

    redirecionarParaCriar() {
      // Redireciona para a página de criação de usuário
      this.$router.push({
        name: "TelaCriarUsuario", // Certifique-se de que o nome da rota está correto
      });
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.login-box {
  display: flex;
  width: 90%;
  max-width: 960px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.login-image {
  flex: 1;
  background-color: #5b3199;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-form {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
}

.logo {
  width: 150px;
  margin: 0 auto 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 10px;
}

.btn-action {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: white;
}

.btn-action.buscar {
  background-color: #6c3fbc;
}

.btn-action.criar {
  background-color: #431f7a;
}

.btn-action:hover {
  opacity: 0.9;
}
</style>
