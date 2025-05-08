<template>
    <div>
      <Navbar />
      <div class="container">
        <div class="content">
          <h2>Resultados da sua Busca</h2>
          <p v-if="termo">Exibindo resultados para: <strong>{{ termo }}</strong></p>
  
          <!-- Painel de Filtros -->
          <div class="filter-container">
            <select v-model="filtros.estado" class="filtro-select" @change="carregarAnuncios">
              <option value="">Selecione o Estado</option>
              <option v-for="estado in estados" :key="estado" :value="estado">
                {{ estado }}
              </option>
            </select>
  
            <!-- Filtro de Cidade -->
            <select v-model="filtros.cidade" class="filtro-select" :disabled="!filtros.estado" @change="carregarAnuncios">
              <option value="">Selecione a Cidade</option>
              <option v-for="cidade in cidades" :key="cidade">
                {{ cidade }}
              </option>
            </select>
            
            <select v-model="filtros.km" class="filtro-select" @change="carregarAnuncios">
              <option value="">Selecione a Distância (km)</option>
              <option value="100">100 km</option>
              <option value="500">500 km</option>
              <option value="1000">1000 km</option>
            </select>
          </div>
  
          <div class="anuncios">
            <div v-for="anuncio in anuncios" :key="anuncio.id" class="anuncio-item">
              <h3>{{ anuncio.titulo }}</h3>
              <p>{{ anuncio.descricao }}</p>
              <p><strong>Preço:</strong> R$ {{ anuncio.preco }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { anuncioApi } from '../Services/http.js'; // Importando a instância Axios para anúncios
  
  export default {
    data() {
      return {
        termo: '',
        filtros: {
          estado: '',
          cidade: '',
          km: '',
        },
        estados: ['SP', 'RJ', 'MG'], // Exemplo de estados
        cidades: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'], // Exemplo de cidades
        anuncios: [],
      };
    },
    methods: {
      async carregarAnuncios() {
        try {
          const response = await anuncioApi.get('/', {
            params: this.filtros, // Envia os filtros para o backend
          });
          this.anuncios = response.data;
        } catch (error) {
          console.error("Erro ao carregar anúncios:", error);
        }
      },
    },
    created() {
      this.carregarAnuncios(); // Carrega os anúncios assim que o componente for criado
    },
  };
  </script>
  
  <style scoped>
  /* Estilo Base */
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
    justify-content: space-between; /* Garante que os elementos dentro do card sejam espaçados */
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
  
  .btn-ver {
    background-color: #5b3199;
    color: white;
    text-decoration: none;
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
    background-color: #5b3199;
    color: white;
  }
  
  .no-results {
    margin-top: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: #f3f3f3;
    color: #333;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
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
  
  .filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    align-items: center;
    background: transparent; 
    padding: 10px;
    margin-bottom: 20px;
  }
  
  .filtro-select,
  input {
    padding: 12px;
    font-size: 16px;
    border: 2px solid #5b3199; /* Cor da borda roxa */
    border-radius: 30px; /* Arredondamento dos botões */
    background: transparent; /* Fundo transparente */
    width: 260px;
    text-align: center; /* Centraliza o texto dentro do select */
    font-weight: bold;
    color: #5b3199; /* Cor do texto roxa */
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }
  
  /* Remove estilos padrão do select */
  .filtro-select:focus,
  input:focus {
    outline: none;
    border-color: #7c42c2; /* Cor mais clara ao focar */
  }
  
  /* Ajuste para a seta dos selects */
  .filtro-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%235b3199' d='M2 0L0 2h4zM2 5l2-2H0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 10px;
  }
  
  .filtro-select::placeholder,
  input::placeholder {
    color: #5b3199; /* Cor roxa */
    opacity: 1; /* Garante que a cor seja visível */
  }
  
  /* Botão Filtrar */
  .btn-filtrar {
    background: #5b3199;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 16px;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }
  
  .btn-filtrar:hover {
    background: #7c42c2;
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .filter-container {
      flex-direction: column;
      gap: 10px;
    }
  
    .filtro-select,
    input {
      width: 100%;
    }
  }
  
  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 10px 15px;
    border: 2px solid #5b3199;
    border-radius: 30px;
    font-size: 16px;
    color: #5b3199;
  }
  
  .search-input::placeholder {
    color: #a080c3;
  }
  
  .btn-pesquisa {
    background-color: #5b3199;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
  }
  
  .btn-pesquisa:hover {
    background-color: #7c42c2;
  }
  
  </style>