<template>
  <div>
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-image">
          <img src="/logos/imagem_login.png" alt="VitrineCar" />
        </div>

        <div class="login-form">
          <img src="/logos/logo_vitrinecar.png" alt="Logo" class="logo" />
          <h2>Acesse sua conta</h2>

          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              v-model="username"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div class="form-group">
            <label for="senha">Senha</label>
            <input
              v-model="password"
              type="password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div class="form-actions">
            <button @click="login" class="btn-action entrar">Entrar</button>
            <button @click="redirecionarParaCriar" class="btn-action criar">Criar Conta</button>
          </div>

          <p v-if="erro" class="erro-msg">⚠️ {{ erro }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TelaLogin",
  data() {
    return {
      username: "",
      password: "",
      erro: null,
    };
  },
  methods: {
    async login() {
      this.erro = null;
      try {
        const token = btoa(`${this.username}:${this.password}`);

        const res = await fetch("http://localhost:8080/anuncios", {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("E-mail ou senha inválidos");
        }

        
        sessionStorage.setItem("authToken", token);
        this.$router.push({ name: "TelaPrincipal" });
      } catch (err) {
        this.erro = err.message;
      }
    },

    redirecionarParaCriar() {
      this.$router.push({ name: "TelaCriarUsuario" });
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
  padding: 20px;
}

.login-box {
  display: flex;
  width: 100%;
  max-width: 1300px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.4s ease-in-out;
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
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  width: 300px;
  margin: 0 auto 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #444;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #6c3fbc;
  outline: none;
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
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: white;
  transition: 0.3s;
}

.btn-action.entrar {
  background-color: #6c3fbc;
}

.btn-action.criar {
  background-color: #431f7a;
}

.btn-action:hover {
  opacity: 0.92;
  transform: scale(1.02);
}

.erro-msg {
  margin-top: 20px;
  color: #d63031;
  font-weight: 500;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
