<template>
  <div>
    <Navbar />

    <!-- Exibição do termo de busca -->
    <div class="search-container">
      <h2>Resultados para "{{ termo }}"</h2>

      <!-- Exibição dos anúncios encontrados -->
      <div v-if="anuncios.length > 0">
        <div v-for="(anuncio, index) in anuncios" :key="anuncio.id" class="anuncio-item">
          <h3>{{ anuncio.titulo }}</h3>
          <p>{{ anuncio.descricao }}</p>
          <p><strong>Preço:</strong> R$ {{ anuncio.preco }}</p>
        </div>
      </div>
      <div v-else>
        <p>Nenhum anúncio encontrado.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi } from '../Services/http.js'; // Importando a instância do Axios configurada para anúncios

export default {
  name: "TelaResultados",
  components: {
    Navbar,
  },
  data() {
    return {
      termo: this.$route.query.termo || "",  // Obtém o termo da busca passado via query params ou vazio
      anuncios: [],  // Lista de anúncios que serão exibidos
    };
  },
  async created() {
    // Chama a função para buscar os anúncios ao carregar a tela
    await this.buscarAnuncios();
  },
  methods: {
    // Função para buscar os anúncios com base no termo
    async buscarAnuncios() {
      try {
        if (!this.termo.trim()) {
          // Se o termo estiver vazio, busca todos os anúncios
          console.log("Buscando todos os anúncios...");
          const response = await anuncioApi.get('/');  // Faz a requisição sem o parâmetro 'termo'
          this.anuncios = response.data;
        } else {
          // Se o termo não estiver vazio, busca anúncios filtrados
          console.log("Buscando anúncios para o termo:", this.termo);
          const response = await anuncioApi.get('/', { params: { termo: this.termo.trim().toLowerCase() } });
          this.anuncios = response.data;
        }
      } catch (error) {
        console.error('Erro ao buscar anúncios:', error);
      }
    }
  },
};
</script>

<style scoped>
/* Estilos para a tela de resultados */
.search-container {
  padding: 40px;
  background-color: #FFF;
  margin: 20px auto;
  width: 80%;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.search-container h2 {
  color: #531B76;
  font-size: 44px;
  margin-bottom: 20px;
}

.anuncio-item {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.anuncio-item h3 {
  color: #531B76;
  font-size: 28px;
  margin-bottom: 10px;
}

.anuncio-item p {
  font-size: 18px;
}

.anuncio-item strong {
  font-weight: bold;
}
</style>
