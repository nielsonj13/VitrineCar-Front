<template>
    <div>
      <Navbar />
  
      <div class="container">
        <div class="content">
          <h2>Criar Novo Anúncio</h2>
  
          <!-- Formulário de criação -->
          <form @submit.prevent="criarAnuncio" class="form-container">
            <div class="form-group">
              <label for="usuarioId">ID do Usuário:</label>
              <input
                v-model="usuarioId"
                type="number"
                id="usuarioId"
                placeholder="Digite o ID do usuário"
                required
              />
            </div>
  
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
              <button type="submit" class="btn-submit">Criar Anúncio</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi, usuarioApi } from "../Services/http.js";

export default {
  name: "TelaCriarAnuncios",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarioId: "",
      anuncio: {
        marca: "",
        modelo: "",
        preco: "",
        anoFabricacao: "",
        anoModelo: "",
        descricao: "",
        imagens: [],
      },
    };
  },

  methods: {
    async buscarUsuarioLogado() {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        this.$router.push("/login");
        return;
      }

      try {
        const response = await usuarioApi.get("/logado", {
          headers: {
            Authorization: `Basic ${token}`
          }
        });

        this.usuarioId = response.data.id;
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        this.$router.push("/login");
      }
    },

    async criarAnuncio() {
      if (!this.usuarioId) {
        alert("Usuário não autenticado.");
        return;
      }

      const anuncioComUsuario = {
        ...this.anuncio,
        usuario: {
          id: this.usuarioId
        }
      };

      try {
        await anuncioApi.post("/", anuncioComUsuario);
        alert("Anúncio criado com sucesso!");
        this.$router.push("/TelaMeusAnuncios");
      } catch (error) {
        console.error("Erro ao criar anúncio:", error);
        alert("Erro ao criar anúncio. Verifique os dados.");
      }
    },

    handleImagemUpload(event) {
      const files = event.target.files;
      const imagens = [];
      for (let i = 0; i < files.length; i++) {
        imagens.push(URL.createObjectURL(files[i]));
      }
      this.anuncio.imagens = imagens;
    }
  },

  async mounted() {
    await this.buscarUsuarioLogado();
  }
};
</script>

  
  <style scoped>
  /* Estilos para a tela de criação de anúncio */
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
  