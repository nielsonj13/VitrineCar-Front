<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <h2>Resultados para "{{ termo }}"</h2>

        <div class="anuncios-container">
          <div v-for="anuncio in anuncios" :key="anuncio.id" class="card">
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
                  :class="getClasseFavorito(anuncio)"
                  class="favorite-icon"
                  @click="toggleFavorito(anuncio)"
                ></i>
              </div>
              <p>R$ {{ anuncio.preco }}</p>
              <span>{{ anuncio.anoFabricacao }}/{{ anuncio.anoModelo }}</span>
            </div>

            <div class="card-actions">
              <button class="btn-ver" @click="verAnuncio(anuncio)">Ver anúncio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi } from '../Services/http.js';

export default {
  name: "TelaResultados",
  components: { Navbar },
  data() {
    return {
      anuncios: [],
      logado: false,
      termo: this.$route.query.termo || "",  // Captura o termo da busca
    };
  },
  async created() {
    const token = sessionStorage.getItem("authToken");
    this.logado = !!token;
    await this.buscarAnuncios();
  },
  methods: {
    async buscarAnuncios() {
      try {
        const response = await anuncioApi.get('/buscar', { params: { termo: this.termo.trim().toLowerCase() } });
        const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

        this.anuncios = response.data.map(anuncio => ({
          ...anuncio,
          favorito: favoritos.includes(anuncio.id)
        }));
      } catch (error) {
        console.error('Erro ao buscar anúncios:', error);
      }
    },

    getImagem(anuncio) {
      return anuncio.imagens?.[0] || '/logos/logo_vitrinecar.png';
    },

    imagemErro(event) {
      event.target.src = '/logos/logo_vitrinecar.png';
    },

    getClasseFavorito(anuncio) {
      if (this.logado && anuncio.favorito) {
        return "bi bi-star-fill";
      } else {
        return "bi bi-star";
      }
    },

    toggleFavorito(anuncio) {
      if (!this.logado) {
        alert("Você precisa estar logado para favoritar um anúncio.");
        return;
      }

      let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

      if (favoritos.includes(anuncio.id)) {
        favoritos = favoritos.filter(id => id !== anuncio.id);
        anuncio.favorito = false;
      } else {
        favoritos.push(anuncio.id);
        anuncio.favorito = true;
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));

      // Atualiza o array de anúncios para manter reatividade
      this.anuncios = this.anuncios.map(a =>
        a.id === anuncio.id ? { ...a, favorito: anuncio.favorito } : a
      );
    },

    verAnuncio(anuncio) {
      this.$router.push({ 
        name: "TelaVeiculo", 
        params: { id: anuncio.id }
      });
    }
  }
};
</script>

<style scoped>
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
</style>
