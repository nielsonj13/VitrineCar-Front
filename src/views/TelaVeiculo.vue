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

        <!-- Miniaturas com rolagem dinâmica limitada -->
        <div class="miniaturas-container">
          <div class="miniaturas">
            <img 
              v-for="(imagem, index) in anuncio.imagens.slice(miniaturaInicio, miniaturaInicio + 4)" 
              :key="'thumb-' + (miniaturaInicio + index)"
              :src="imagem" 
              class="miniatura img-thumbnail" 
              @click="selecionarImagem(miniaturaInicio + index)" 
              :class="{ active: (miniaturaInicio + index) === imagemSelecionada }"
              @error="imagemErro($event)" 
              alt="Miniatura do veículo"
            >
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
      miniaturaInicio: 0,
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
  mounted() {
    document.addEventListener("keydown", this.tecladoNavegacao);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.tecladoNavegacao);
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
      this.atualizarMiniaturas();
    },
    proximaImagem() {
      if (this.imagemSelecionada < this.anuncio.imagens.length - 1) {
        this.imagemSelecionada++;
      } else {
        this.imagemSelecionada = 0;
      }
      this.atualizarMiniaturas();
    },
    anteriorImagem() {
      if (this.imagemSelecionada > 0) {
        this.imagemSelecionada--;
      } else {
        this.imagemSelecionada = this.anuncio.imagens.length - 1;
      }
      this.atualizarMiniaturas();
    },
    atualizarMiniaturas() {
      if (this.imagemSelecionada < this.miniaturaInicio) {
        this.miniaturaInicio = this.imagemSelecionada;
      } else if (this.imagemSelecionada >= this.miniaturaInicio + 4) {
        this.miniaturaInicio = this.imagemSelecionada - 3;
      }
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

    tecladoNavegacao(event) {
      if (event.key === "ArrowRight") {
        this.proximaImagem();
      } else if (event.key === "ArrowLeft") {
        this.anteriorImagem();
      } else if (event.key === "Escape") {
        this.fecharTelaCheia();
      }
    },

    toggleFavorito() {
      alert("Função para favoritar ainda não implementada.");
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
.modal-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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
  font-size: 30px;
  color: #5b3199;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  z-index: 10000;
}

.modal-prev, .modal-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 50px;
  padding: 10px;
  color: #5b3199;
  cursor: pointer;
  z-index: 10000;
}

.modal-prev { left: 20px; }
.modal-next { right: 20px; }

.carrossel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
}

.imagem-principal img {
  width: 600px;
  height: 400px;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  margin-bottom: 10px;
}

.imagem-principal img:hover {
  transform: scale(1.03);
}

.nav-button {
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  z-index: 10;
}

.left {
  left: -40px;
}

.right {
  right: -40px;
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
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s, border 0.3s;
}

.miniatura:hover,
.miniatura.active {
  transform: scale(1.1);
  border-color: #5b3199;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  background: #fdf9f9;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  gap: 10px;
}

.info-wrapper {
  display: flex;
  gap: 40px;
}

.info-section {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.seller-name {
  font-size: 45px;
  font-weight: bold;
  color: #5b3199;
}

.contact-info p {
  font-size: 21px;
  display: block;
}

i {
  color: #5b3199;
}

.descricao-container {
  margin-top: 15px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  text-align: justify;
}

.descricao-btn {
  background: none;
  border: none;
  color: #5b3199;
  font-size: 14px;
  cursor: pointer;
  margin-top: 5px;
  font-weight: bold;
}

.descricao-btn:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .nav-button {
    display: none !important;
  }
  .carrossel-container {
    flex-direction: column;
  }

  .imagem-principal img {
    width: 100%;
    height: auto;
  }

  .miniaturas {
    flex-direction: row;
    justify-content: center;
  }

  .miniatura {
    width: 80px;
    height: 60px;
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
  }

  .info-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .seller-name {
    font-size: 24px;
  }

  .contact-info p {
    font-size: 18px;
    display: block;
  }
}
</style>
