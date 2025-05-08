<template>
    <div>
      <Navbar />
  
      <!-- Conteúdo Principal -->
      <div class="container">
        <div class="content">
          <h2>Todos os Veículos Anunciados</h2>
  
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
                <span>{{ anuncio.ano }}/{{ anuncio.ano }}</span>
              </div>
  
              <div class="card-actions">
                <button class="btn-ver" @click="verAnuncio(anuncio.id)">Ver anúncio</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "../components/NavBar.vue";
  import { anuncioApi } from '../Services/http.js';  // Importando a instância do Axios configurada para anúncios
  
  export default {
    name: "TelaAnuncios",
    components: {
      Navbar,
    },
    data() {
      return {
        anuncios: [],  // Lista de anúncios que serão exibidos
      };
    },
    async created() {
      await this.buscarAnuncios();  // Busca todos os anúncios ao carregar a tela
    },
    methods: {
      // Função para buscar todos os anúncios
      async buscarAnuncios() {
        try {
          const response = await anuncioApi.get('');  // Faz a requisição para listar todos os anúncios
          this.anuncios = response.data;  // Armazena os anúncios retornados
        } catch (error) {
          console.error('Erro ao buscar anúncios:', error);
        }
      },
  
      // Função para obter a imagem do anúncio (caso tenha múltiplas imagens)
      getImagem(anuncio) {
        if (anuncio.imagens && Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0) {
          return anuncio.imagens[0];  // Retorna a primeira imagem se existir
        }
        return '/logos/logo_vitrinecar.png';  // Imagem padrão caso não tenha imagens
      },
  
      // Função para exibir erro ao carregar a imagem
      imagemErro(event) {
        event.target.src = '/logos/logo_vitrinecar.png';  // Substitui por imagem padrão se houver erro
      },
  
      // Função para alternar o favorito do anúncio
      toggleFavorito(anuncio) {
        anuncio.favorito = !anuncio.favorito;
        // Aqui você pode fazer uma requisição para salvar o estado do favorito no backend, se necessário
      },
  
      // Função para visualizar o anúncio
      verAnuncio(id) {
        this.$router.push({ name: 'TelaDetalhesAnuncio', params: { id: id } });  // Redireciona para a tela de detalhes do anúncio
      }
    },
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
  