<template>
  <div>
    <Navbar />

    <div class="container">
      <div class="content">
        <h2>Meus Anúncios</h2>

        <!-- Exibição dos anúncios -->
        <div class="anuncios-container">
          <div v-for="(anuncio, index) in anuncios" :key="anuncio.id" class="card">
            <img 
              :src="getImagem(anuncio)" 
              alt="Imagem do veículo" 
              @error="imagemErro($event)"
              class="img-fluid"
            />

            <div class="car-info">
              <div class="title-container">
                <h3>{{ anuncio.marca }} {{ anuncio.modelo }}</h3>
                <i
                  :class="anuncio.favorito ? 'bi bi-star-fill' : 'bi bi-star'"
                  class="favorite-icon"
                  @click="toggleFavorito(anuncio)"
                ></i>
              </div>
              <p>R$ {{ anuncio.preco }}</p>
              <span>{{ anuncio.anoFabricacao }}/{{ anuncio.anoModelo }}</span>
            </div>

            <div class="card-actions">
              <button class="btn-ver" @click="verAnuncio(anuncio)">Ver anúncio</button>
              <button class="btn-vendido" @click="marcarComoVendido(anuncio)">Marcar como Vendido</button>
              <button class="btn-editar" @click="editarAnuncio(anuncio.id)">Editar anúncio</button>
              <button class="btn-excluir" @click="excluirAnuncio(anuncio.id)">Excluir anúncio</button>
            </div>
          </div>

          <!-- Card para criar novo anúncio (exibido ao lado dos outros anúncios) -->
          <div class="new-card" @click="criarNovoAnuncio">
            <div class="new-icon">+</div>
            <p>Criar Novo Anúncio</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi, usuarioApi } from "../Services/http.js";

export default {
  name: "TelaMeusAnuncios",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarioId: "",
      anuncios: [],
    };
  },

  methods: {
    async buscarUsuarioLogado() {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        this.$router.push("/login"); // 🔴 Redireciona se não estiver logado
        return;
      }

      try {
        const response = await usuarioApi.get("/logado", {
          headers: {
            Authorization: `Basic ${token}`
          }
        });

        this.usuarioId = response.data.id;
        this.buscarAnunciosUsuario();
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        this.$router.push("/login"); // 🔴 Redireciona se o token for inválido
      }
    },

    async buscarAnunciosUsuario() {
      if (!this.usuarioId) return;

      try {
        const anunciosResponse = await anuncioApi.get(`/usuario/${this.usuarioId}`);
        this.anuncios = anunciosResponse.data;
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
        alert("Erro ao buscar anúncios.");
      }
    },

    getImagem(anuncio) {
      if (anuncio.imagens?.length > 0) {
        return anuncio.imagens[0];
      }
      return '/logos/logo_vitrinecar.png';
    },

    imagemErro(event) {
      event.target.src = '/logos/logo_vitrinecar.png';
    },

    toggleFavorito(anuncio) {
      anuncio.favorito = !anuncio.favorito;
    },

    verAnuncio(anuncio) {
      this.$router.push({ 
        name: "TelaVeiculo", 
        params: { id: anuncio.id, usuarioId: this.usuarioId }
      });
    },

    async marcarComoVendido(anuncio) {
      anuncio.vendido = true;
      alert(`O anúncio ${anuncio.marca} ${anuncio.modelo} foi marcado como vendido.`);
    },

    editarAnuncio(id) {
      this.$router.push({ name: "TelaEditarAnuncios", params: { id } });
    },

    async excluirAnuncio(id) {
      try {
        await anuncioApi.delete(`/${id}`);
        this.anuncios = this.anuncios.filter(anuncio => anuncio.id !== id);
        alert("Anúncio excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir anúncio:", error);
        alert("Erro ao excluir o anúncio.");
      }
    },

    criarNovoAnuncio() {
      this.$router.push({ name: "TelaCriarAnuncios" });
    }
  },

  mounted() {
    this.buscarUsuarioLogado();
  }
};
</script>


<style scoped>
/* Estilo similar ao da tela de anúncios */
.container {
  max-width: 80%;
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

.anuncios-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;
  padding: 15px;
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.car-info {
  text-align: left;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-container h3 {
  margin: 10px 0;
  color: #333;
  flex: 1;
  text-align: left;
}

.favorite-icon {
  cursor: pointer;
  font-size: 30px;
  color: #ddd;
  transition: transform 0.3s ease;
}

.favorite-icon.bi-star-fill {
  color: #5b3199;
}

.favorite-icon:hover {
  transform: scale(1.2);
}

.car-info p {
  margin: 0;
  color: #5b3199;
  font-weight: bold;
}

.car-info span {
  font-size: 14px;
  color: #666;
}

.card-actions {
  margin-top: 10px;
}

.card-actions button {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.btn-ver {
  background-color: #5b3199;
  color: white;
  text-decoration: none;
}

.btn-vendido {
  background-color: #28a745;
  color: white;
}

.btn-editar {
  background-color: #ffc107;
  color: white;
}

.btn-excluir {
  background-color: #dc3545;
  color: white;
}

.vendido-label {
  display: inline-block;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.vendido-banner {
  background-color: #e4ffdd; /* Fundo vermelho claro */
  color: #28a745; /* Vermelho escuro */
  font-weight: bold;
  text-align: center;
  padding: 12px; /* Aumenta o padding para centralizar melhor */
  border-radius: 8px;
  border: 1px solid #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Espaçamento entre ícone e texto */
  height: 80px; /* Define uma altura fixa */
}

.vendido-banner i {
  font-size: 20px;
  color: #28a745;
}

.vendido-banner p {
  margin: 0; /* Remove margens extras que estavam desalinhando o texto */
  line-height: 1.2; /* Ajusta a altura da linha para melhor alinhamento */
}

.new-card {
  background-color: #f3f3f3;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
}

.new-icon {
  font-size: 50px;
  color: #5b3199;
  font-weight: bold;
}

.new-card p {
  margin-top: 10px;
  color: #333;
  font-weight: bold;
}

.criar-anuncio {
  margin-top: 20px;
}

.btn-criar {
  background-color: #5b3199;
  color: white;
  padding: 15px;
  font-size: 16px;
  width: 100%;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
</style>
