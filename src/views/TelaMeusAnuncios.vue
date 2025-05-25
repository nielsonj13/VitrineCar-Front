<template>
  <div>
    <Navbar />

    <div class="container">
      <div class="content">
        <h2>Meus Anúncios</h2>

        <!-- Busca por nome com autocomplete -->
        <div v-if="!usuarioSelecionado" class="input-container">
          <label for="usuarioNome">Informe o nome do usuário:</label>
          <input 
            type="text" 
            v-model="usuarioNome" 
            placeholder="Digite o nome do usuário"
            autocomplete="off"
            @input="buscarUsuarios"
          />
          <ul v-if="usuariosSugeridos.length" class="autocomplete-list">
            <li
              v-for="usuario in usuariosSugeridos"
              :key="usuario.id"
              @click="selecionarUsuario(usuario)"
              class="autocomplete-item"
            >
              <strong>{{ usuario.nome }}</strong> — <small>{{ usuario.email }}</small>
            </li>
          </ul>
        </div>

        <!-- Exibição do usuário selecionado e botão para limpar -->
        <div v-if="usuarioSelecionado" class="usuario-selecionado">
          <p><strong>Usuário selecionado:</strong> {{ usuarioSelecionado.nome }} ({{ usuarioSelecionado.email }})</p>
          <button @click="limparUsuarioSelecionado" class="btn-limpar">Alterar usuário</button>
        </div>

        <!-- Exibição dos anúncios -->
        <div v-if="usuarioSelecionado" class="anuncios-container">
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
              <button class="btn-ver" @click="verAnuncio(anuncio)">Ver anúncio</button>
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
import { anuncioApi, usuarioApi } from "../Services/http.js";

export default {
  name: "TelaMeusAnuncios",
  components: {
    Navbar,
  },
  data() {
    return {
      usuarioNome: "",
      usuariosSugeridos: [],
      usuarioSelecionado: null,
      anuncios: [],
    };
  },
  methods: {
    async buscarUsuarios() {
      if (this.usuarioNome.length < 2) {
        this.usuariosSugeridos = [];
        return;
      }
      try {
        const response = await usuarioApi.get(`/search?nome=${encodeURIComponent(this.usuarioNome)}`);
        this.usuariosSugeridos = response.data;
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        this.usuariosSugeridos = [];
      }
    },

    async selecionarUsuario(usuario) {
      this.usuarioSelecionado = usuario;
      this.usuarioNome = usuario.nome;
      this.usuariosSugeridos = [];
      await this.buscarAnunciosUsuario();
    },

    limparUsuarioSelecionado() {
      this.usuarioSelecionado = null;
      this.usuarioNome = "";
      this.anuncios = [];
      this.usuariosSugeridos = [];
    },

    async buscarAnunciosUsuario() {
      if (!this.usuarioSelecionado) {
        alert("Selecione um usuário válido para buscar anúncios.");
        return;
      }
      try {
        const anunciosResponse = await anuncioApi.get(`/usuario/${this.usuarioSelecionado.id}`);
        this.anuncios = anunciosResponse.data;
      } catch (error) {
        console.error("Erro ao buscar meus anúncios:", error);
        alert("Erro ao buscar anúncios. Tente novamente.");
      }
    },

    getImagem(anuncio) {
      if (anuncio.imagens && Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0) {
        return anuncio.imagens[0];
      }
      return '/logos/logo_vitrinecar.png';
    },

    imagemErro(event) {
      event.target.src = '/logos/logo_vitrinecar.png';
    },

    toggleFavorito(anuncio) {
      anuncio.favorito = !anuncio.favorito;
      // Se quiser, pode salvar essa alteração no backend
    },

    verAnuncio(anuncio) {
      this.$router.push({ 
        name: "TelaVeiculo", 
        params: { id: anuncio.id, usuarioId: this.usuarioSelecionado.id }
      });
    },

    marcarComoVendido(anuncio) {
      anuncio.vendido = true;
      alert(`O anúncio ${anuncio.marca} ${anuncio.modelo} foi marcado como vendido.`);
      // Se quiser, envie essa atualização para o backend
    },

    editarAnuncio(id) {
      this.$router.push({ name: "TelaEditarAnuncios", params: { id } });
    },

    async excluirAnuncio(id) {
      try {
        await anuncioApi.delete(`/${id}`);
        this.anuncios = this.anuncios.filter(a => a.id !== id);
        alert("Anúncio excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o anúncio:", error);
        alert("Erro ao excluir o anúncio.");
      }
    },

    criarNovoAnuncio() {
      this.$router.push({ name: "TelaCriarAnuncios" });
    },
  },
};
</script>

<style scoped>
/* Estilos gerais */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 30px;
  font-family: 'Arial', sans-serif;
}

.content {
  text-align: center;
}

h2 {
  color: #5b3199;
  margin-bottom: 20px;
  font-size: 2rem;
}

/* Estilo do campo de busca */
.input-container {
  position: relative;
  margin-bottom: 20px;
}

.input-container label {
  display: block;
  font-size: 1rem;
  margin-bottom: 10px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
  margin-bottom: 10px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #5b3199;
  outline: none;
}

.autocomplete-list {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.autocomplete-item {
  padding: 8px 12px;
  cursor: pointer;
}

.autocomplete-item:hover {
  background-color: #f0f0f0;
}

/* Estilo do usuário selecionado */
.usuario-selecionado {
  margin-bottom: 20px;
  font-size: 1rem;
  text-align: left;
}

.usuario-selecionado p {
  margin-bottom: 10px;
}

.btn-limpar {
  background-color: #f39c12;
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-limpar:hover {
  background-color: #e67e22;
}

/* Cards de anúncios */
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
  position: relative;
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
  margin-top: 20px;
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
</style>