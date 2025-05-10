<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <!-- Etapa 1: Pergunta o ID do Anúncio -->
        <div v-if="!anuncioIdInformado">
          <h2>Editar Anúncio</h2>
          <label for="anuncioId">Informe o ID do Anúncio:</label>
          <input 
            type="number" 
            v-model="anuncioId"
            placeholder="ID do Anúncio"
          />
          <button @click="buscarAnuncio">Buscar Anúncio</button>
        </div>

        <!-- Etapa 2: Formulário de Edição do Anúncio -->
        <div v-if="anuncioIdInformado" class="edit-form">
          <h2>Editar Anúncio - ID: {{ anuncio.id }}</h2>
          
          <label for="marca">Marca:</label>
          <input v-model="anuncio.marca" type="text" id="marca" />

          <label for="modelo">Modelo:</label>
          <input v-model="anuncio.modelo" type="text" id="modelo" />

          <label for="preco">Preço:</label>
          <input v-model="anuncio.preco" type="number" id="preco" />

          <label for="anoFabricacao">Ano de Fabricação:</label>
          <input v-model="anuncio.anoFabricacao" type="number" id="anoFabricacao" />

          <label for="anoModelo">Ano do Modelo:</label>
          <input v-model="anuncio.anoModelo" type="number" id="anoModelo" />

          <label for="descricao">Descrição:</label>
          <textarea v-model="anuncio.descricao" id="descricao"></textarea>

          <label for="imagens">Imagem:</label>
          <input v-model="anuncio.imagens" type="text" id="imagens" />

          <button @click="salvarAlteracoes">Salvar Alterações</button>
        </div>
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
      anuncioId: "",  // ID do anúncio fornecido pelo usuário
      anuncio: {},  // Detalhes do anúncio que será editado
      anuncioIdInformado: false,  // Flag para saber se o ID foi informado
    };
  },
  methods: {
    // Etapa 1: Buscar o Anúncio com o ID informado
    async buscarAnuncio() {
      if (!this.anuncioId) {
        alert("Por favor, informe o ID do anúncio.");
        return;
      }

      try {
        // Faz a requisição para buscar os dados do anúncio
        const response = await anuncioApi.get(`/${this.anuncioId}`);
        this.anuncio = response.data;  // Preenche as informações do anúncio no formulário
        this.anuncioIdInformado = true;  // Marca o ID como informado, permitindo exibir os dados
      } catch (error) {
        console.error("Erro ao buscar o anúncio:", error);
        alert("Erro ao carregar o anúncio. Tente novamente.");
      }
    },

    // Etapa 2: Salvar as alterações feitas no anúncio
    async salvarAlteracoes() {
      try {
        // Faz a requisição para atualizar o anúncio
        await anuncioApi.put(`/${this.anuncioId}`, this.anuncio);
        alert("Anúncio editado com sucesso!");
        this.$router.push({ name: "TelaAnuncios" });
      } catch (error) {
        console.error("Erro ao editar o anúncio:", error);
        alert("Erro ao editar o anúncio. Tente novamente.");
      }
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

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.edit-form button {
  background-color: #5b3199;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-form button:hover {
  background-color: #4a1c6e;
}
</style>
