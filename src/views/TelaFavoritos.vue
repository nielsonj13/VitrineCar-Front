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
import favoritoService from "../Services/favoritoservice.js";

export default {
  name: "TelaFavoritos",
  components: { Navbar },
  data() {
    return {
      favoritos: [],
      usuarioId: null,
    };
  },
  methods: {
    async carregarFavoritos() {
      try {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario || !usuario.id) {
          return;
        }

        this.usuarioId = usuario.id;

        const response = await favoritoService.listarFavoritos(this.usuarioId);

        // Mapeia os favoritos retornando apenas os dados do anúncio
        this.favoritos = response.data.map(fav => ({
          ...fav.anuncio,
          favorito: true
        }));
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      }
    },

    async toggleFavorito(anuncio) {
      try {
        if (anuncio.favorito) {
          await favoritoService.desfavoritar(this.usuarioId, anuncio.id);
          this.favoritos = this.favoritos.filter(a => a.id !== anuncio.id);
        }
      } catch (error) {
        console.error("Erro ao desfavoritar:", error);
        alert("Erro ao remover dos favoritos.");
      }
    },

    getImagem(anuncio) {
      return anuncio.imagens?.[0] || "/logos/logo_vitrinecar.png";
    },

    imagemErro(event) {
      event.target.src = "/logos/logo_vitrinecar.png";
    },

    verAnuncio(anuncio) {
      this.$router.push({ name: "TelaVeiculo", params: { id: anuncio.id } });
    }
  },

  mounted() {
    this.carregarFavoritos();
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
