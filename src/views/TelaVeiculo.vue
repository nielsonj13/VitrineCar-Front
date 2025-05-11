<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <h2>Detalhes do Anúncio</h2>

        <div v-if="anuncio">
          <div class="card">
            <div class="car-images">
              <img :src="getImagem(anuncio)" alt="Imagem do veículo" class="img-main" />
              <div class="img-thumbnails">
                <img v-for="(image, index) in anuncio.imagens" :src="image" :key="index" class="img-thumbnail" />
              </div>
            </div>
            
            <div class="car-info">
              <h3>{{ anuncio.marca }} {{ anuncio.modelo }}</h3>
              <p><strong>Título:</strong> {{ anuncio.titulo }}</p>
              <p><strong>Preço:</strong> R$ {{ anuncio.preco.toFixed(2) }}</p>
              <p><strong>Ano de Fabricação:</strong> {{ anuncio.anoFabricacao }}</p>
              <p><strong>Ano do Modelo:</strong> {{ anuncio.anoModelo }}</p>
              <p><strong>Descrição:</strong> {{ anuncio.descricao || 'Sem descrição disponível' }}</p>
              <p><strong>Favorito:</strong> {{ anuncio.favorito === 'true' ? 'Sim' : 'Não' }}</p>
            </div>

            <div class="user-info">
              <h4>Informações do Usuário</h4>
              <p><strong>Nome:</strong> {{ anuncio.usuario.nome }}</p>
              <p><strong>Email:</strong> {{ anuncio.usuario.email }}</p>
              <p><strong>Telefone:</strong> {{ anuncio.usuario.telefone }}</p>
              <p><strong>Localização:</strong> {{ anuncio.usuario.localizacao }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi } from "../Services/http.js";  // API configurada para anúncios

export default {
  name: "TelaVeiculo",
  components: {
    Navbar,
  },
  data() {
    return {
      anuncio: null,  // Dados do anúncio
      usuarioId: null, // ID do usuário
    };
  },
  created() {
    const anuncioId = this.$route.params.id;
    this.usuarioId = this.$route.params.usuarioId;
    
    this.buscarAnuncio(anuncioId);
  },
  methods: {
    async buscarAnuncio(id) {
      try {
        const response = await anuncioApi.get(`/${id}`);
        this.anuncio = response.data;
      } catch (error) {
        console.error("Erro ao buscar anúncio:", error);
        alert("Erro ao carregar os detalhes do anúncio.");
      }
    },

    getImagem(anuncio) {
      return anuncio.imagens && anuncio.imagens.length > 0 ? anuncio.imagens[0] : '/logos/logo_vitrinecar.png';
    },
  },
};
</script>

<style scoped>
/* Estilo para TelaVeiculo - Detalhes do anúncio */

.container {
  max-width: 85%;
  margin: 0 auto;
  padding: 20px;
}

.content {
  text-align: center;
  padding: 20px;
}

h2 {
  color: #5b3199;
  margin-bottom: 20px;
  font-size: 28px;
}

.card {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.car-images {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-main {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
}

.img-thumbnails {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.img-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.img-thumbnail:hover {
  transform: scale(1.1);
}

.car-info {
  font-size: 18px;
  color: #333;
}

.car-info h3 {
  color: #5b3199;
  font-size: 24px;
  margin-bottom: 10px;
}

.car-info p {
  margin: 8px 0;
}

.user-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
}

.user-info h4 {
  color: #5b3199;
  font-size: 20px;
  margin-bottom: 10px;
}


</style>
