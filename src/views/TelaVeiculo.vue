<template>
  <div>
    <Navbar />
    <div class="container" v-if="anuncio">
      
      <!-- Carrossel de Imagens -->
      <div class="carrossel-container">
        <!-- Botão Anterior -->
        <button class="nav-button left" @click="anteriorImagem">
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Imagem Principal -->
        <div class="imagem-principal">
          <img :src="imagemSelecionadaSrc" class="main-image" 
               alt="Imagem do veículo" @click="abrirTelaCheia" @error="imagemErro($event)">
        </div>

        <!-- Botão Próximo -->
        <button class="nav-button right" @click="proximaImagem">
          <i class="bi bi-chevron-right"></i>
        </button>

        <!-- Miniaturas com rolagem dinâmica -->
        <div class="miniaturas-container">
          <div class="miniaturas">
            <img 
              v-for="(imagem, index) in anuncio.imagens" 
              :key="'thumb-' + index"
              :src="imagem" 
              class="miniatura img-thumbnail" 
              @click="selecionarImagem(index)" 
              :class="{ active: index === imagemSelecionada }"
              @error="imagemErro($event)" 
              alt="Miniatura do veículo">
          </div>
        </div>
      </div>

      <!-- Modal de Tela Cheia -->
      <div v-if="telaCheiaAtiva" class="modal-fullscreen" @click="fecharTelaCheia">
        <button class="close-button" @click.stop="fecharTelaCheia">×</button>
        <button class="modal-prev" @click.stop="anteriorImagem">&#10094;</button>
        <img :src="imagemSelecionadaSrc" class="fullscreen-image" @error="imagemErro($event)"/>
        <button class="modal-next" @click.stop="proximaImagem">&#10095;</button>
      </div>

      <!-- Informações do Veículo -->
      <div class="vehicle-info">
        <div class="price-title">
          <div>
            <h1 class="vehicle-title">{{ anuncio.marca }} {{ anuncio.modelo }}</h1>
          </div>
          <div class="price-container">
            <p class="vehicle-price">R$ {{ anuncio.preco.toFixed(2) }}</p>
            <i 
              :class="anuncio.favorito === 'true' ? 'bi bi-star-fill' : 'bi bi-star'" 
              class="favorite-icon" 
              @click="toggleFavorito"
            ></i>
          </div>
        </div>

        <div class="info-wrapper">
          <!-- Informações do Veículo -->
          <div class="info-section">
            <h4>Informações do Veículo</h4>
            <div class="info-grid">
              <p><i class="bi bi-calendar"></i> <strong>Ano:</strong> {{ anuncio.anoModelo }}/{{ anuncio.anoFabricacao }}</p>
              <p><strong>Título:</strong> {{ anuncio.titulo }}</p>
              <p><i class="bi bi-card-text"></i> <strong>Descrição:</strong> {{ anuncio.descricao || 'Sem descrição disponível' }}</p>
            </div>
          </div>

          <!-- Informações do Usuário -->
          <div class="info-section">
            <h4>Informações do Usuário</h4>
            <p><i class="bi bi-person-circle"></i> <strong>Nome:</strong> {{ anuncio.usuario.nome }}</p>
            <p><i class="bi bi-envelope"></i> <strong>Email:</strong> {{ anuncio.usuario.email }}</p>
            <p><i class="bi bi-telephone"></i> <strong>Telefone:</strong> {{ anuncio.usuario.telefone }}</p>
            <p><i class="bi bi-geo-alt"></i> <strong>Localização:</strong> {{ anuncio.usuario.localizacao }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="loading">Carregando anúncio...</p>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi } from "../Services/http.js";

export default {
  name: "TelaVeiculo",
  components: {
    Navbar,
  },
  data() {
    return {
      anuncio: null,
      imagemSelecionada: 0,
      telaCheiaAtiva: false,
    };
  },
  computed: {
    imagemSelecionadaSrc() {
      if (this.anuncio && this.anuncio.imagens && this.anuncio.imagens.length > 0) {
        return this.anuncio.imagens[this.imagemSelecionada];
      }
      return '/logos/logo_vitrinecar.png';
    }
  },
  created() {
    const anuncioId = this.$route.params.id;
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

    imagemErro(event) {
      event.target.src = '/logos/logo_vitrinecar.png';
    },

    selecionarImagem(index) {
      this.imagemSelecionada = index;
    },

    proximaImagem() {
      if (!this.anuncio || !this.anuncio.imagens) return;
      this.imagemSelecionada = (this.imagemSelecionada + 1) % this.anuncio.imagens.length;
    },

    anteriorImagem() {
      if (!this.anuncio || !this.anuncio.imagens) return;
      this.imagemSelecionada = (this.imagemSelecionada - 1 + this.anuncio.imagens.length) % this.anuncio.imagens.length;
    },

    abrirTelaCheia() {
      this.telaCheiaAtiva = true;
      document.addEventListener("keydown", this.fecharComEsc);
    },

    fecharTelaCheia() {
      this.telaCheiaAtiva = false;
      document.removeEventListener("keydown", this.fecharComEsc);
    },

    fecharComEsc(event) {
      if (event.key === "Escape") {
        this.fecharTelaCheia();
      }
    },

    toggleFavorito() {
      alert("Função para favoritar ainda não implementada.");
      // Aqui você pode implementar a lógica para favoritar/desfavoritar
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  font-size: 22px;
  color: #5b3199;
  padding: 50px 0;
}

.carrossel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  margin-bottom: 30px;
}

.imagem-principal {
  width: 600px;
  height: 400px;
}

.main-image {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.main-image:hover {
  transform: scale(1.03);
}

.nav-button {
  background: none;
  border: none;
  font-size: 30px;
  color: #5b3199;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  user-select: none;
}

.left {
  left: -50px;
}

.right {
  right: -50px;
}

.miniaturas-container {
  max-width: 120px;
}

.miniaturas {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.miniatura {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s, border 0.3s;
  border: 2px solid transparent;
}

.miniatura:hover, .miniatura.active {
  transform: scale(1.1);
  border-color: #5b3199;
}

.modal-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.fullscreen-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 30px;
  background: none;
  font-size: 40px;
  color: #5b3199;
  border: none;
  cursor: pointer;
  z-index: 10001;
}

.modal-prev, .modal-next {
  position: absolute;
  top: 50%;
  background: none;
  border: none;
  font-size: 60px;
  color: #5b3199;
  cursor: pointer;
  padding: 10px;
  user-select: none;
  z-index: 10001;
  transform: translateY(-50%);
}

.modal-prev {
  left: 20px;
}

.modal-next {
  right: 20px;
}

.vehicle-info {
  background: #fdf9f9;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto 40px;
}

.price-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f3f3f3;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.vehicle-title {
  font-size: 36px;
  font-weight: bold;
  color: #5b3199;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vehicle-price {
  font-size: 40px;
  font-weight: bold;
  color: #5b3199;
}

.favorite-icon {
  cursor: pointer;
  font-size: 35px;
  color: #ccc;
  transition: all 0.3s ease-in-out;
  margin-left: 25px;
  vertical-align: middle;
  position: relative;
  top: -9px;
}

.favorite-icon.bi-star-fill {
  color: #5b3199;
}

.favorite-icon:hover {
  transform: scale(1.2);
  color: #7c42c2;
}

.info-wrapper {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.info-section {
  flex: 1 1 300px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
}

.info-section h4 {
  margin-bottom: 15px;
  color: #5b3199;
}

.info-grid p {
  margin: 8px 0;
  font-size: 18px;
}

.info-grid i {
  margin-right: 8px;
  color: #5b3199;
}

/* Responsividade */
@media (max-width: 768px) {
  .carrossel-container {
    flex-direction: column;
  }

  .imagem-principal {
    width: 100%;
    height: auto;
  }

  .nav-button {
    display: none;
  }

  .miniaturas {
    flex-direction: row;
    justify-content: center;
    gap: 8px;
  }

  .miniatura {
    width: 60px;
    height: 50px;
  }

  .vehicle-info {
    padding: 20px 15px;
  }

  .price-title {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .vehicle-title {
    font-size: 28px;
  }

  .vehicle-price {
    font-size: 30px;
  }

  .favorite-icon {
    font-size: 30px;
    margin-left: 10px;
    top: -5px;
  }

  .info-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .info-section {
    box-shadow: none;
    padding: 15px 10px;
  }
}
</style>
