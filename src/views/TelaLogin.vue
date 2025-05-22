<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="fazerLogin">
      <div>
        <label>Usuário</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Senha</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Entrar</button>
    </form>
    <p v-if="erro" class="error">{{ erro }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      erro: null,
    };
  },
  methods: {
    async fazerLogin() {
      this.erro = null;
      try {
        // Codifica em base64 usuário:senha
        const token = btoa(`${this.username}:${this.password}`);

        // Testa autenticação fazendo uma requisição ao backend
        const res = await fetch("http://localhost:8080/anuncios", {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Usuário ou senha inválidos");
        }

        // Salva token na sessão (ou localStorage) para usar em outras requisições
        sessionStorage.setItem("authToken", token);

        // Redireciona para a página inicial ou dashboard
        this.$router.push({ name: "TelaPrincipal" });

      } catch (err) {
        this.erro = err.message;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}
input {
  width: 100%;
  margin-bottom: 15px;
  padding: 8px;
  font-size: 16px;
}
button {
  padding: 10px;
  width: 100%;
  background-color: #5b3199;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
