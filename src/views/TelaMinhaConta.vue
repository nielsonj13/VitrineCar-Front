<template>
    <Navbar />
  <div class="minha-conta-wrapper">
    <div class="header">
      <h2>Minha Conta</h2>
    </div>
    
    <div class="content">
      <!-- Dados Pessoais -->
      <div class="personal-data">
        <h3>Meus Dados</h3>
        <form @submit.prevent="salvarAlteracoes">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="userData.email" required />
          </div>

          <div class="form-group">
            <label for="nome">Nome</label>
            <input type="text" id="nome" v-model="userData.nome" required />
          </div>

          <div class="form-group">
            <label for="sobrenome">Sobrenome</label>
            <input type="text" id="sobrenome" v-model="userData.sobrenome" required />
          </div>

          <div class="form-group">
            <label for="dataNascimento">Data de Nascimento</label>
            <input type="date" id="dataNascimento" v-model="userData.dataNascimento" required />
          </div>

          <div class="form-group">
            <label for="cpf">CPF</label>
            <input type="text" id="cpf" v-model="userData.cpf" required />
          </div>
        </form>
      </div>

      <!-- Endereço e Contato -->
      <div class="contact-info">
        <h3>Endereço e Contato</h3>
        <form @submit.prevent="salvarAlteracoes">
          <div class="form-group">
            <label for="cep">CEP</label>
            <input type="text" id="cep" v-model="userData.cep" required />
          </div>

          <div class="form-group">
            <label for="cidade">Cidade</label>
            <input type="text" id="cidade" v-model="userData.cidade" required />
          </div>

          <div class="form-group">
            <label for="estado">Estado</label>
            <input type="text" id="estado" v-model="userData.estado" required />
          </div>

          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input type="text" id="telefone" v-model="userData.telefone" required />
          </div>

          <div class="form-group">
            <label for="emailContato">Email para Contato</label>
            <input type="email" id="emailContato" v-model="userData.emailContato" required />
          </div>
        </form>
      </div>
    </div>

    <!-- Botões de ação abaixo do card -->
    <div class="actions">
      <button @click="salvarAlteracoes" class="btn-save">Salvar Alterações</button>
      <button @click="excluirConta" class="btn-delete">Excluir Conta</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi } from "../Services/http.js";


export default {
  data() {
    return {
      userData: {
        email: "",
        nome: "",
        sobrenome: "",
        dataNascimento: "",
        cpf: "",
        cep: "",
        cidade: "",
        estado: "",
        telefone: "",
        emailContato: ""
      }
    };
  },
  methods: {
    async salvarAlteracoes() {
      try {
        const response = await usuarioApi.put(`/usuarios/${this.userData.email}`, this.userData);
        alert("Alterações salvas com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar alterações:", error);
        alert("Erro ao salvar alterações.");
      }
    },
    async excluirConta() {
      try {
        const response = await usuarioApi.delete(`/usuarios/${this.userData.email}`);
        alert("Conta excluída com sucesso!");
        this.$router.push("/login");
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Erro ao excluir conta.");
      }
    }
  }
};
</script>

<style scoped>
.minha-conta-wrapper {
  margin: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.personal-data,
.contact-info {
  width: 45%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #5b3199;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.actions {
  display: flex;
  flex-direction: column; /* Alinha os botões verticalmente */
  gap: 15px; /* Espaço entre os botões */
  justify-content: center;
  margin-top: 30px;
  text-align: center; /* Centraliza os botões */
}

.btn-save,
.btn-delete {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-save {
  background-color: #5b3199;
  color: white;
}

.btn-save:hover {
  background-color: #431f7a;
}

.btn-delete {
  background-color: #e53e3e;
  color: white;
}


</style>
