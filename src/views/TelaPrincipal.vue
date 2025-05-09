<template>
  <div>
    <Navbar />

    <!-- Área de Busca -->
    <div class="search-container">
      <h2>Procure seu Veículo!</h2>
      <div class="search-bar input-group">
        <input 
          type="text" 
          v-model="busca" 
          class="form-control" 
          placeholder="Digite marca ou modelo do veículo"
          @keyup.enter="buscarAnuncios(busca)"  
        />
        <button @click="buscarAnuncios(busca)" class="btn btn-primary">Ver Ofertas</button>
      </div>
    </div>

    <!-- Seção de Marcas e Categorias -->
    <div class="brands-categories">
      <div class="brands">
        <h3>Principais Marcas</h3>
        <div class="brand-logos">
          <img 
            v-for="(marca, index) in marcas" 
            :key="index" 
            :src="marca.img" 
            :alt="marca.nome" 
            class="img-fluid"
            @click="buscarAnuncios(marca.nome)"  
          />
        </div>
      </div>

      <div class="categories">
        <h3>Categorias</h3>
        <div class="category-logos">
          <div v-for="(categoria, index) in categorias" :key="index" class="category-item">
            <img 
              :src="categoria.img" 
              :alt="categoria.nome" 
              class="img-fluid"
              @click="buscarAnuncios(categoria.nome)"  
            />
            <p class="category-name">{{ categoria.nome }}</p>
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
  name: "BuscarVeiculo",
  components: {
    Navbar,
  },
  data() {
    return {
      busca: "",
      marcas: [
        { nome: "Fiat", img: "/logos/FIAT_logo.png" },
        { nome: "BMW", img: "/logos/BMW_logo.png" },
        { nome: "Nissan", img: "/logos/Nissan_logo.png" },
        { nome: "Toyota", img: "/logos/TOYOTA_logo.png" },
        { nome: "Renault", img: "/logos/RENAULT_logo.png" },
      ],
      categorias: [
        { nome: "SUV", img: "/carro/sw4.png" },
        { nome: "Picape", img: "/carro/Ram-3500 1.png" },
        { nome: "Sedan", img: "/carro/corolla.png" },
        { nome: "Hatch", img: "/carro/golf.png" },
      ],
    };
  },
  methods: {
    async buscarAnuncios(termo) {
  try {
    if (!termo.trim()) {
      alert("Por favor, insira um termo de busca.");
      return;
    }

    // Exibe no console o termo que está sendo buscado
    console.log("Buscando anúncios para o termo:", termo);

    // Certifique-se de que a URL está sendo montada corretamente
    const response = await anuncioApi.get('/', { params: { termo: termo.trim().toLowerCase() } });

    // Redireciona para a tela de resultados passando o termo da busca na query
    this.$router.push({ name: "TelaResultados", query: { termo: termo.trim().toLowerCase() } });

  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
  }
}
  },
};
</script>

<style scoped>
/* Estilos gerais */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #F3F3F3;
  color: #333;
}

/* Área de busca */
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

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar input {
  background-color: #dfdfdf;
  padding: 20px;
  font-size: 20px;
  border: 1px solid #CCC;
  border-radius: 20px;
  width: 80%;
}

.search-bar button {
  background-color: #531B76;
  color: white;
  padding: 20px 50px;
  font-size: 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 10px;
}

/* Seção de marcas e categorias */
.brands-categories {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  width: 80%;
  margin: 0 auto;
}

.brands,
.categories {
  width: 100%;
  margin-bottom: 20px;
}

.brands h3,
.categories h3 {
  font-size: 40px;
  margin-bottom: 15px;
  color: #531B76;
  text-align: center;
}

.brand-logos,
.category-logos {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.brand-logos img,
.category-logos img {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  margin: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.category-item {
  text-align: center;
}

.category-name {
  font-size: 14px;
  color: #333;
  margin-top: 5px;
}

/* Responsividade */
@media (max-width: 768px) {
  .search-container {
    width: 95%;
    padding: 20px;
  }
  .search-container h2 {
    font-size: 32px;
  }
  .search-bar {
    flex-direction: column;
  }
  .search-bar input {
    width: 100%;
    margin-bottom: 10px;
    padding: 15px;
    font-size: 18px;
  }
  .search-bar button {
    width: 100%;
    padding: 15px;
    font-size: 18px;
  }
}
</style>
