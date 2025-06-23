<template>
  <div>
    <Navbar />
    
    <div class="container" v-if="anuncio">
      <!-- Carrossel de Imagens -->
      <div class="carrossel-container">
        <button class="nav-button left" @click="anteriorImagem">
          <i class="bi bi-chevron-left"></i>
        </button>

        <div class="imagem-principal">
          <img :src="imagemSelecionadaSrc" class="main-image"
               alt="Imagem do veículo" @click="abrirTelaCheia" @error="imagemErro($event)">
        </div>

        <button class="nav-button right" @click="proximaImagem">
          <i class="bi bi-chevron-right"></i>
        </button>

        <div class="miniaturas-container">
          <div class="miniaturas">
            <img v-for="(imagem, index) in anuncio.imagens.slice(miniaturaInicio, miniaturaInicio + 4)"
              :key="'thumb-' + (miniaturaInicio + index)"
              :src="imagem"
              class="miniatura img-thumbnail"
              @click="selecionarImagem(miniaturaInicio + index)"
              :class="{ active: (miniaturaInicio + index) === imagemSelecionada }"
              @error="imagemErro($event)" />
          </div>
        </div>
      </div>

      <!-- Modal de imagem cheia -->
      <div v-if="telaCheiaAtiva" class="modal-fullscreen" @click="fecharTelaCheia">
        <button class="close-button" @click.stop="fecharTelaCheia">×</button>
        <button class="modal-prev" @click.stop="anteriorImagem">❮</button>
        <img :src="imagemSelecionadaSrc" class="fullscreen-image" @error="imagemErro($event)" />
        <button class="modal-next" @click.stop="proximaImagem">❯</button>
      </div>

      <!-- Informações do Veículo e Usuário -->
      <div class="vehicle-info">
        <div class="price-title">
          <h1 class="vehicle-title">{{ anuncio.marca }} {{ anuncio.modelo }}</h1>
          <div class="price-container">
            <p class="vehicle-price">R$ {{ anuncio.preco.toFixed(2) }}</p>
            <i :class="anuncio.favorito ? 'bi bi-star-fill' : 'bi bi-star'"
               class="favorite-icon"
               @click="toggleFavorito"></i>
          </div>
        </div>

        <div class="info-wrapper">
          <!-- Informações do Veículo -->
          <div class="info-section">
            <h4>Informações do Veículo</h4>
            <div class="info-grid">
              <p><i class="bi bi-calendar"></i> <strong>Ano:</strong> {{ anuncio.anoModelo }}/{{ anuncio.anoFabricacao }}</p>
              <p><i class="bi bi-palette"></i> <strong>Cor:</strong> {{ anuncio.cor || 'Não informado' }}</p>
              <p><i class="bi bi-speedometer2"></i> <strong>Km Rodado:</strong> {{ anuncio.km || 'Não informado' }}</p>
              <p><i class="bi bi-gear"></i> <strong>Câmbio:</strong> {{ anuncio.cambio || 'Não informado' }}</p>
              <p><i class="bi bi-fuel-pump"></i> <strong>Combustível:</strong> {{ anuncio.combustivel || 'Não informado' }}</p>
              <p><i class="bi bi-car-front"></i> <strong>Categoria:</strong> {{ anuncio.categoria || 'Não informado' }}</p>
            </div>

            <p class="options"><strong>Opcionais:</strong> {{ anuncio.opcionais?.length ? anuncio.opcionais.join(', ') : 'Nenhum' }}</p>
            <p class="descricao">
              <strong>Descrição:</strong>
              {{ verDescricao ? (anuncio.descricao || 'Sem descrição disponível.') : (anuncio.descricao ? anuncio.descricao.slice(0, 100) + '...' : 'Sem descrição disponível.') }}
            </p>

            <button v-if="anuncio.descricao && anuncio.descricao.length > 100"
              @click="verDescricao = !verDescricao"
              class="descricao-btn">
              {{ verDescricao ? "Ocultar descrição" : "Ver descrição" }}
            </button>
              
          </div>

          <!-- Informações do Usuário -->
          <div class="info-section">
            <h4>Informações do Usuário</h4>
            <p class="seller-name"><i class="bi bi-person-circle"></i> {{ anuncio.usuario.nome }}</p>
            <div class="contact-info">
              <p><i class="bi bi-envelope"></i> <strong>Email:</strong> {{ anuncio.usuario.email }}</p>
              <p><i class="bi bi-telephone"></i> <strong>Telefone:</strong> {{ anuncio.usuario.telefone }}</p>
              <p><i class="bi bi-geo-alt"></i> <strong>Localização:</strong> {{ anuncio.usuario.localizacao }}</p>
              </div>
          </div>
        </div>
        <!-- Link discreto para denúncia -->
        <a href="#" class="denunciar-link" @click.prevent="abrirModalDenuncia = true">
          <i class="bi bi-flag-fill me-1"></i> Denunciar
        </a>
      </div>
    </div>
    

    <div v-else>
      <p class="loading">Carregando anúncio...</p>
    </div>

    <!-- Modal de Denúncia -->
    <div v-if="abrirModalDenuncia" class="fixed">
      <div class="modal-content">
        <button @click="abrirModalDenuncia = false" class="modal-close">&times;</button>

        <h2>Denunciar Anúncio</h2>

        <input v-model="denuncia.nome" placeholder="Seu nome" />
        <input v-model="denuncia.email" type="email" placeholder="Seu e-mail" />

        <select v-model="denuncia.motivo">
          <option disabled value="">Selecione o motivo</option>
          <option>Fraude</option>
          <option>Informações falsas</option>
          <option>Conteúdo impróprio</option>
          <option>Outro</option>
        </select>

        <textarea v-model="denuncia.detalhes" placeholder="Descreva o que aconteceu" rows="4"></textarea>

        <button @click="enviarDenuncia" class="btn-enviar">Enviar denúncia</button>
      </div>
    </div>

  </div>
</template>


<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi, denunciaApi } from "../Services/http.js";

export default {
  name: "TelaVeiculo",
  components: { Navbar },
  data() {
    return {
      anuncio: null,
      imagemSelecionada: 0,
      miniaturaInicio: 0,
      telaCheiaAtiva: false,
      verDescricao: false,
      usuarioLogado: false,
      abrirModalDenuncia: false,
      denuncia: {
        nome: '',
        email: '',
        motivo: '',
        detalhes: '',
      }
    };
  },
  computed: {
    imagemSelecionadaSrc() {
      return this.anuncio?.imagens?.[this.imagemSelecionada] || '/logos/logo_vitrinecar.png';
    },
  },
  created() {
    const anuncioId = this.$route.params.id;
    this.buscarAnuncio(anuncioId);
    this.usuarioLogado = !!sessionStorage.getItem("authToken");
  },
  mounted() {
    document.addEventListener("keydown", this.tecladoNavegacao);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.tecladoNavegacao);
  },
  methods: {
    async enviarDenuncia() {
      try {
        const payload = {
          ...this.denuncia,
          anuncio: { id: this.anuncio.id },
        };

        await denunciaApi.post("", payload);
        alert("Denúncia enviada com sucesso!");
        this.abrirModalDenuncia = false;
        this.denuncia = { nome: '', email: '', motivo: '', detalhes: '' };
      } catch (error) {
        console.error("Erro ao enviar denúncia:", error);
        alert("Erro ao enviar denúncia. Verifique os dados ou tente novamente.");
      }
    },
    async buscarAnuncio(id) {
      try {
        const response = await anuncioApi.get(`/${id}`);
        const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
        this.anuncio = {
          ...response.data,
          favorito: favoritos.includes(response.data.id)
        };
      } catch (error) {
        console.error("Erro ao buscar anúcio:", error);
        alert("Erro ao carregar os detalhes do anúcio.");
      }
    },
    toggleFavorito() {
      if (!this.usuarioLogado) {
        alert("Você precisa estar logado para favoritar um anúcio.");
        return;
      }
      let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
      if (this.anuncio.favorito) {
        favoritos = favoritos.filter(id => id !== this.anuncio.id);
        this.anuncio.favorito = false;
      } else {
        favoritos.push(this.anuncio.id);
        this.anuncio.favorito = true;
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    },
    imagemErro(event) {
      event.target.src = '/logos/logo_vitrinecar.png';
    },
    selecionarImagem(index) {
      this.imagemSelecionada = index;
      this.atualizarMiniaturas();
    },
    proximaImagem() {
      this.imagemSelecionada = (this.imagemSelecionada + 1) % this.anuncio.imagens.length;
      this.atualizarMiniaturas();
    },
    anteriorImagem() {
      this.imagemSelecionada = (this.imagemSelecionada - 1 + this.anuncio.imagens.length) % this.anuncio.imagens.length;
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
      if (event.key === "Escape") this.fecharTelaCheia();
    },
    tecladoNavegacao(event) {
      if (event.key === "ArrowRight") this.proximaImagem();
      else if (event.key === "ArrowLeft") this.anteriorImagem();
      else if (event.key === "Escape") this.fecharTelaCheia();
    }
  }
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

.fixed {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px 25px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  font-family: 'Segoe UI', sans-serif;
  animation: fadeInScale 0.3s ease;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.modal-content input,
.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  transition: border 0.3s;
}

.modal-content input:focus,
.modal-content select:focus,
.modal-content textarea:focus {
  border-color: #531B76;
  outline: none;
}

.btn-enviar {
  background: #531B76;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
}

.btn-enviar:hover {
  background: #3e1156;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 28px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
}

.modal-close:hover {
  color: #000;
}

.vehicle-info {
  position: relative;
  padding-bottom: 40px; /* espaço para o link não sobrepor conteúdo */
}

.denunciar-link {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 0.85rem;
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.denunciar-link:hover {
  color: #dc3545;
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
