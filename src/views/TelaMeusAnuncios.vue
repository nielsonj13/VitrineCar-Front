<template>
  <div>
    <Navbar />

    <div class="container">
      <div class="content">
        <h2>Meus Anúncios</h2>

        <!-- Formulário para inserir o ID do usuário -->
        <div v-if="!usuarioIdInformado">
          <label for="usuarioId">Informe o ID do Usuário:</label>
          <input 
            type="number" 
            v-model="usuarioId" 
            placeholder="ID do Usuário" 
          />
          <button @click="buscarAnunciosUsuario">Buscar Anúncios</button>
        </div>

        <!-- Exibição dos anúncios -->
        <div v-if="usuarioIdInformado" class="anuncios-container">
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
              <span>{{ anuncio.anoFabricacao }}/{{ anuncio.anoModelo }}</span>
            </div>

            <div class="card-actions">
              <button class="btn-ver" @click="verAnuncio(anuncio.id)">Ver anúncio</button>
              <button class="btn-vendido" @click="marcarComoVendido(anuncio)">Marcar como Vendido</button>
              <button class="btn-editar" @click="editarAnuncio(anuncio.id)">Editar anúncio</button>
              <button class="btn-excluir" @click="excluirAnuncio(anuncio.id)">Excluir anúncio</button>
            </div>
          </div>

          <!-- Card para criar novo anúncio (exibido ao lado dos outros anúncios) -->
          <div class="new-card" @click="criarNovoAnuncio">
            <div class="new-icon">+</div>
            <p>Criar Novo Anúncio</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi, usuarioApi } from "../Services/http.js";  // Importando as instâncias do Axios configuradas

export default {
  name: "TelaMeusAnuncios",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarioId: "",  // O ID do usuário fornecido
      anuncios: [],  // Lista de anúncios que o usuário tem
      usuarioIdInformado: false,  // Flag para indicar se o ID do usuário foi informado
    };
  },
  methods: {
    // Função para buscar os anúncios do usuário após inserir o ID
    async buscarAnunciosUsuario() {
      if (!this.usuarioId) {
        alert("Por favor, informe o ID do usuário.");
        return;
      }

      try {
        // Primeiro, verificamos se o usuário existe (usando `buscarUsuarioPorId`)
        const usuarioResponse = await usuarioApi.get(`/${this.usuarioId}`);
        
        // Se o usuário não for encontrado, exibe uma mensagem de erro
        if (!usuarioResponse.data) {
          alert("Usuário não encontrado.");
          return;
        }

        // Depois, obtemos os anúncios do usuário (usando `listarAnunciosPorUsuario`)
        const anunciosResponse = await anuncioApi.get(`/usuario/${this.usuarioId}`);
        this.anuncios = anunciosResponse.data;  // Preenche a lista com os anúncios do usuário

        this.usuarioIdInformado = true;  // Marca o ID como informado, permitindo exibir os anúncios
      } catch (error) {
        console.error("Erro ao buscar meus anúncios:", error);
        alert("Erro ao buscar anúncios. Tente novamente.");
      }
    },

    // Função para obter a imagem do anúncio (caso tenha múltiplas imagens)
    getImagem(anuncio) {
      if (anuncio.imagens && Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0) {
        return anuncio.imagens[0];  // Retorna a primeira imagem
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
      this.$router.push({ name: "TelaDetalhesAnuncio", params: { id: id } });  // Redireciona para a tela de detalhes do anúncio
    },

    // Função para marcar o anúncio como vendido
    async marcarComoVendido(anuncio) {
      anuncio.vendido = true;
      // Aqui você pode enviar uma requisição para salvar o status de 'vendido' no backend
      alert(`O anúncio ${anuncio.marca} ${anuncio.modelo} foi marcado como vendido.`);
    },

    // Função para editar o anúncio
    editarAnuncio(id) {
      this.$router.push({ name: "TelaEditarAnuncios", params: { id: id } });  // Redireciona para a tela de editar
    },

    // Função para excluir o anúncio
    async excluirAnuncio(id) {
      try {
        await anuncioApi.delete(`/${id}`);  // Faz a requisição para excluir o anúncio
        this.anuncios = this.anuncios.filter(anuncio => anuncio.id !== id);  // Atualiza a lista de anúncios
        alert("Anúncio excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o anúncio:", error);
        alert("Erro ao excluir o anúncio.");
      }
    },

    // Função para redirecionar para a tela de criação de anúncio
    criarNovoAnuncio() {
      this.$router.push({ name: "TelaCriarAnuncios" });  // Redireciona para a tela de criação de anúncio
    }
  },
};
</script>

<style scoped>
/* Estilo similar ao da tela de anúncios */
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

.btn-vendido {
  background-color: #28a745;
  color: white;
}

.btn-editar {
  background-color: #ffc107;
  color: white;
}

.btn-excluir {
  background-color: #dc3545;
  color: white;
}

.vendido-label {
  display: inline-block;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.vendido-banner {
  background-color: #e4ffdd; /* Fundo vermelho claro */
  color: #28a745; /* Vermelho escuro */
  font-weight: bold;
  text-align: center;
  padding: 12px; /* Aumenta o padding para centralizar melhor */
  border-radius: 8px;
  border: 1px solid #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Espaçamento entre ícone e texto */
  height: 80px; /* Define uma altura fixa */
}

.vendido-banner i {
  font-size: 20px;
  color: #28a745;
}

.vendido-banner p {
  margin: 0; /* Remove margens extras que estavam desalinhando o texto */
  line-height: 1.2; /* Ajusta a altura da linha para melhor alinhamento */
}

.new-card {
  background-color: #f3f3f3;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
}

.new-icon {
  font-size: 50px;
  color: #5b3199;
  font-weight: bold;
}

.new-card p {
  margin-top: 10px;
  color: #333;
  font-weight: bold;
}

.criar-anuncio {
  margin-top: 20px;
}

.btn-criar {
  background-color: #5b3199;
  color: white;
  padding: 15px;
  font-size: 16px;
  width: 100%;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
</style>
