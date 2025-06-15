<template>
  <div>
    <Navbar />

    <div class="container">
      <h2>Meus Favoritos</h2>

      <div v-if="favoritos.length === 0" class="sem-favoritos">
        <p>Você ainda não adicionou nenhum anúncio aos favoritos.</p>
      </div>

      <div class="anuncios-container">
        <div v-for="anuncio in favoritos" :key="anuncio.id" class="card">
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

          <button class="btn-ver" @click="verAnuncio(anuncio)">Ver anúncio</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi, usuarioApi } from "../Services/http.js";

export default {
  name: "TelaFavoritos",
  components: { Navbar },
  data() {
    return {
      usuarioId: "",
      favoritos: [],
    };
  },
  methods: {
    async buscarUsuarioLogado() {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        sessionStorage.setItem("mensagemAlerta", "Você precisa estar logado para ver os favoritos.");
        this.$router.push({ name: "TelaLogin" });
        return;
      }

      try {
        const response = await usuarioApi.get("/logado", {
          headers: { Authorization: `Basic ${authToken}` }
        });

        this.usuarioId = response.data.id;
        await this.carregarFavoritos();
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        this.$router.push("/login");
      }
    },

    async carregarFavoritos() {
      const favoritosIds = JSON.parse(localStorage.getItem("favoritos") || "[]");

      try {
        const response = await anuncioApi.get(`/usuario/${this.usuarioId}`);
        this.favoritos = response.data
          .filter(a => favoritosIds.includes(a.id))
          .map(a => ({ ...a, favorito: true }));
      } catch (error) {
        console.error("Erro ao buscar anúncios favoritos:", error);
      }
    },

    toggleFavorito(anuncio) {
      anuncio.favorito = !anuncio.favorito;

      let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

      if (anuncio.favorito) {
        favoritos.push(anuncio.id);
      } else {
        favoritos = favoritos.filter(id => id !== anuncio.id);
        // remove da tela instantaneamente
        this.favoritos = this.favoritos.filter(a => a.id !== anuncio.id);
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    },

    getImagem(anuncio) {
      return anuncio.imagens?.[0] || '/logos/logo_vitrinecar.png';
    },

    imagemErro(event) {
      event.target.src = '/logos/logo_vitrinecar.png';
    },

    verAnuncio(anuncio) {
      this.$router.push({ name: "TelaVeiculo", params: { id: anuncio.id, usuarioId: this.usuarioId } });
    }
  },

  mounted() {
    this.buscarUsuarioLogado();
  }
};
</script>

<style scoped>
.container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px 0;
}

h2 {
  text-align: center;
  color: #5b3199;
  margin-bottom: 20px;
}

.sem-favoritos {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 40px;
}

.anuncios-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 15px;
  text-align: center;
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
  font-weight: bold;
  color: #5b3199;
  margin: 5px 0;
}

.car-info span {
  font-size: 14px;
  color: #666;
}

.btn-ver {
  background-color: #5b3199;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
