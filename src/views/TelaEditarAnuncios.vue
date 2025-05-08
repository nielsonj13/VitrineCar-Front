<template>
  <div>
    <Navbar />
    
    <div class="container">
      <div class="content">
        <h2>Editar Anúncio</h2>

        <!-- Formulário de edição -->
        <form @submit.prevent="editarAnuncio" class="form-container">
          <div class="form-group">
            <label for="marca">Marca:</label>
            <input
              v-model="anuncio.marca"
              type="text"
              id="marca"
              placeholder="Digite a marca do veículo"
              required
            />
          </div>

          <div class="form-group">
            <label for="modelo">Modelo:</label>
            <input
              v-model="anuncio.modelo"
              type="text"
              id="modelo"
              placeholder="Digite o modelo do veículo"
              required
            />
          </div>

          <div class="form-group">
            <label for="preco">Preço:</label>
            <input
              v-model="anuncio.preco"
              type="number"
              id="preco"
              placeholder="Digite o preço do veículo"
              required
            />
          </div>

          <div class="form-group">
            <label for="anoFabricacao">Ano de Fabricação:</label>
            <input
              v-model="anuncio.anoFabricacao"
              type="number"
              id="anoFabricacao"
              placeholder="Digite o ano de fabricação"
              required
            />
          </div>

          <div class="form-group">
            <label for="anoModelo">Ano do Modelo:</label>
            <input
              v-model="anuncio.anoModelo"
              type="number"
              id="anoModelo"
              placeholder="Digite o ano do modelo"
              required
            />
          </div>

          <div class="form-group">
            <label for="descricao">Descrição:</label>
            <textarea
              v-model="anuncio.descricao"
              id="descricao"
              placeholder="Digite a descrição do veículo"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="imagem">Imagem:</label>
            <input
              v-model="anuncio.imagens"
              type="text"
              id="imagem"
              placeholder="URL da imagem do veículo"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi } from "../Services/http.js";  // Importando a instância do Axios configurada para anúncios

export default {
  name: "TelaEditarAnuncio",
  components: {
    Navbar,
  },
  data() {
    return {
      anuncioId: this.$route.params.id,  // Obtém o ID do anúncio a ser editado
      anuncio: {
        marca: "",
        modelo: "",
        preco: "",
        anoFabricacao: "",
        anoModelo: "",
        descricao: "",
        imagens: "",
      },
    };
  },
  async created() {
    await this.carregarAnuncio();  // Carrega os dados do anúncio ao carregar a tela
  },
  methods: {
    // Função para carregar os dados do anúncio
    async carregarAnuncio() {
      try {
        const response = await anuncioApi.get(`${this.anuncioId}`);
        this.anuncio = response.data;  // Preenche os dados do anúncio no formulário
      } catch (error) {
        console.error('Erro ao carregar anúncio:', error);
      }
    },

    // Função para enviar os dados de edição para o backend
    async editarAnuncio() {
      try {
        const response = await anuncioApi.put(`${this.anuncioId}`, this.anuncio);
        alert("Anúncio editado com sucesso!");
        this.$router.push({ name: "TelaAnuncios" });
      } catch (error) {
        console.error("Erro ao editar anúncio:", error);
        alert("Erro ao editar anúncio. Tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
/* Mesmo estilo da tela de criar anúncio */
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

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  text-align: center;
}

.btn-submit {
  background-color: #5b3199;
  color: white;
  padding: 15px 30px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #431f7a;
}
</style>
