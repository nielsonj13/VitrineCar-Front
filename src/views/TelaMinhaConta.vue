<template>
  <Navbar />
  <div class="container mt-5">
    

    <h2 class="mb-4">Minha Conta</h2>

    <div v-if="usuario">
      <div class="card p-3 shadow-sm">
        <p><strong>Nome:</strong> {{ usuario.nome }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <p><strong>Tipo de Conta:</strong> {{ usuario.role }}</p>

        <button class="btn btn-primary mt-3" @click="irParaEdicao">
          Editar Conta
        </button>
      </div>
    </div>

    <div v-else class="text-muted">
      Carregando suas informações...
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { usuarioApi } from "../Services/http.js";

export default {
  name: "TelaMinhaConta",
  components: { Navbar },
  data() {
    return {
      usuario: null,
    };
  },
  methods: {
    async buscarUsuarioLogado() {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        sessionStorage.setItem("mensagemAlerta", "Você precisa estar logado para acessar sua conta.");
        this.$router.push({ name: "TelaLogin" });
        return;
      }

      try {
        const response = await usuarioApi.get("/logado", {
          headers: { Authorization: `Basic ${authToken}` }
        });

        this.usuario = response.data;
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        alert("Erro ao carregar seus dados.");
        this.$router.push("/login");
      }
    },

    irParaEdicao() {
      this.$router.push({ name: "TelaEditarUsuario", params: { id: this.usuario.id } });
    }
  },
  mounted() {
    this.buscarUsuarioLogado();
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
