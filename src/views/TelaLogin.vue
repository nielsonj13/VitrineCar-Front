<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="fazerLogin">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div>
        <label for="senha">Senha:</label>
        <input v-model="senha" type="password" id="senha" required />
      </div>
      <button type="submit">Entrar</button>
      <p v-if="erro" class="erro">{{ erro }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      senha: '',
      erro: ''
    }
  },
  methods: {
    async fazerLogin() {
      try {
        const token = btoa(`${this.email}:${this.senha}`)
        const response = await axios.get('http://localhost:8080/usuarios', {
          headers: {
            Authorization: `Basic ${token}`
          }
        })

        // Armazena o token (ou outro dado, como usuário)
        sessionStorage.setItem('authToken', token)
        alert('Login realizado com sucesso!')
        // Redirecionar ou mudar de página
        this.$router.push('/') // ou outra rota protegida

      } catch (err) {
        this.erro = 'Credenciais inválidas. Verifique email e senha.'
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 8px;
  margin: 6px 0 12px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #005fa3;
}

.erro {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
