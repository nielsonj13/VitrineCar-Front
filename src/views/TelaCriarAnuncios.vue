<template>
  <div>
    <Navbar />
    <h2>Criar Anúncio</h2>
    <div class="container">

      <div v-if="etapa === 1" class="content">
        <h3>Preencha as informações do veículo</h3>
        <div class="form">
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
            <label for="tipoVeiculo">Tipo de Veículo:</label>
            <select v-model="anuncio.tipoVeiculo" id="tipoVeiculo" required>
              <option disabled value="">Selecione o tipo de veículo</option>
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="caminhao">Caminhão</option>
              <option value="outro">Outro</option>
            </select>
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
            <label for="anoFabricacao">Ano de Fabricação:</label>
            <input
              v-model="anuncio.anoFabricacao"
              type="text"
              id="anoFabricacao"
              placeholder="Digite o ano de fabricação"
              @input="validarAno('anoFabricacao')"
              required
            />
          </div>

          <div class="form-group">
            <label for="anoModelo">Ano do Modelo:</label>
            <input
              v-model="anuncio.anoModelo"
              type="text"
              id="anoModelo"
              placeholder="Digite o ano do modelo"
              @input="validarAno('anoModelo')"
              required
            />
          </div>

          <div class="form-group">
            <label>Quilometragem (km)</label>
            <input type="text" v-model="anuncio.km" placeholder="Digite a quilometragem" @input="formatarKm"/>
          </div>

          <div class="form-group">
            <label for="cor">Cor:</label>
            <select v-model="anuncio.cor" id="cor" required>
              <option disabled value="">Selecione a cor</option>
              <option>Amarelo</option>
              <option>Azul</option>
              <option>Bege</option>
              <option>Branco</option>
              <option>Cinza</option>
              <option>Dourado</option>
              <option>Grená</option>
              <option>Laranja</option>
              <option>Marrom</option>
              <option>Prata</option>
              <option>Preto</option>
              <option>Rosa</option>
              <option>Roxo</option>
              <option>Verde</option>
              <option>Vermelho</option>
              <option>Outro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="categoria">Categoria:</label>
            <select v-model="anuncio.categoria" id="categoria" required>
              <option disabled value="">Selecione a categoria</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Picape</option>
              <option>Hatch</option>
              <option>Esportivo</option>
              <option>MiniVan</option>
              <option>Moto</option>
              <option>Outro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="cambio">Câmbio:</label>
            <select v-model="anuncio.cambio" id="cambio" required>
              <option disabled value="">Selecione o câmbio</option>
              <option>Automático</option>
              <option>Manual</option>
              <option>CVT</option>
              <option>Outro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="combustivel">Combustível:</label>
            <select v-model="anuncio.combustivel" id="combustivel" required>
              <option disabled value="">Selecione o combustível</option>
              <option>Gasolina</option>
              <option>Diesel</option>
              <option>Etanol</option>
              <option>Híbrido</option>
              <option>Flex</option>
              <option>Elétrico</option>
              <option>Outro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="preco">Preço:</label>
            <input
              v-model="anuncio.preco"
              type="text"
              id="preco"
              placeholder="Digite o preço do veículo"
              @input="formatarValor"
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
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="actions">
          <button class="btn-next" @click="avancarEtapa">Próximo</button>
        </div>
      </div>

      <!-- Etapa 2: Opcionais -->
      <div v-else-if="etapa === 2" class="content">
        <h3>Informe os opcionais do veículo</h3>
        <div class="opcionais">
          <div
            v-for="opcional in opcionais"
            :key="opcional"
            class="opcional"
            :class="{ active: anuncio.opcionais.includes(opcional) }"
            @click="toggleOpcional(opcional)"
          >
            {{ opcional }}
          </div>
        </div>
        <div class="actions">
          <button class="btn-back" @click="voltarEtapa">Voltar</button>
          <button class="btn-next" @click="avancarEtapa">Próximo</button>
        </div>
      </div>

      <!-- Etapa 3: Imagens -->
      <div v-else-if="etapa === 3" class="content">
        <h3>Adicionar imagens do veículo</h3>
        <div class="upload-box">
          <div class="form-group" v-for="(imagem, index) in anuncio.imagens" :key="index">
            <label>Link da Imagem {{ index + 1 }}</label>
            <div class="input-container">
              <input
                type="text"
                v-model="anuncio.imagens[index]"
                placeholder="Insira o link da imagem"
              />
              <button
                v-if="index > 0"
                @click="removerImagem(index)"
                class="remove-btn"
                title="Remover imagem"
                type="button"
              >
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </div>

          <button
            type="button"
            class="btn-adicionar"
            @click="adicionarImagem"
            :disabled="anuncio.imagens.length >= 10"
          >
            + Adicionar Imagem
          </button>
        </div>
        <div class="actions">
          <button class="btn-back" @click="voltarEtapa">Voltar</button>
          <button class="btn-finish" @click="finalizarAnuncio">Finalizar</button>
        </div>
      </div>

      <div v-if="diasParaLiberar > 0" class="alerta-limite">
        <p>
          Você atingiu o limite de 5 anúncios. Aguarde
          <strong>{{ diasParaLiberar }} dia(s)</strong> para criar novos.
        </p>
      </div>
      <div v-else class="alerta-limite">
        <p>
          Você pode criar
          <strong>{{ anunciosRestantes }}</strong> anúncio(s) agora.
        </p>
      </div>
    </div>
<<<<<<< HEAD
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
=======
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi } from "../Services/http.js";

export default {
  name: "TelaCriarAnuncio",
  components: { Navbar },
  data() {
    return {
      etapa: 1,
      usuarioId: "",
      anuncio: {
        tipoVeiculo: "",
>>>>>>> main
        marca: "",
        modelo: "",
        preco: "",
        anoFabricacao: "",
        anoModelo: "",
<<<<<<< HEAD
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
=======
        km: "",
        cor: "",
        categoria: "",
        cambio: "",
        combustivel: "",
        descricao: "",
        imagens: [""],
        opcionais: [],
      },
      opcionais: [
        "Air Bag",
        "Alarme",
        "Ar Condicionado",
        "Travas Elétricas",
        "Vidros Elétricos",
        "Freio ABS",
        "Computador de bordo",
        "Teto Solar",
        "Tração 4X4",
        "Desembaçador Traseiro",
      ],
      diasParaLiberar: 0,
      anunciosRestantes: 5,
    };
  },
  watch: {
    usuarioId(novoId) {
      if (novoId) {
        this.atualizarStatusLimite();
      } else {
        this.diasParaLiberar = 0;
        this.anunciosRestantes = 5;
      }
    },
  },
  methods: {
    validarAno(campo) {
      this.anuncio[campo] = this.anuncio[campo].replace(/\D/g, "");
      if (this.anuncio[campo].length > 4) {
        this.anuncio[campo] = this.anuncio[campo].slice(0, 4);
      }
    },
    formatarValor() {
      if (this.anuncio.preco) {
        let num = this.anuncio.preco.replace(/\D/g, "");
        if (!num) {
          this.anuncio.preco = "";
          return;
        }
        this.anuncio.preco = new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(num) / 100);
      }
    },
    adicionarImagem() {
      if (this.anuncio.imagens.length < 10) this.anuncio.imagens.push("");
    },
    removerImagem(index) {
      this.anuncio.imagens.splice(index, 1);
    },
    toggleOpcional(opcional) {
      const idx = this.anuncio.opcionais.indexOf(opcional);
      if (idx === -1) {
        this.anuncio.opcionais.push(opcional);
      } else {
        this.anuncio.opcionais.splice(idx, 1);
      }
    },
    avancarEtapa() {
      if (this.etapa === 1) {
        const camposObrigatorios = [
          "usuarioId",
          "tipoVeiculo",
          "marca",
          "modelo",
          "preco",
          "anoFabricacao",
          "anoModelo",
          "cor",
          "categoria",
          "cambio",
          "combustivel",
          "descricao",
        ];

        for (const campo of camposObrigatorios) {
          if (
            campo === "usuarioId"
              ? !this.usuarioId
              : !this.anuncio[campo] || this.anuncio[campo].trim() === ""
          ) {
            alert(`Por favor, preencha o campo obrigatório: ${campo}`);
            return;
          }
        }
        const anoAtual = new Date().getFullYear();
        const anoFab = parseInt(this.anuncio.anoFabricacao);
        const anoMod = parseInt(this.anuncio.anoModelo);

        if (anoFab < 1886 || anoFab > anoAtual) {
          alert(`Ano de fabricação inválido. Deve estar entre 1886 e ${anoAtual}.`);
          return;
        }
        if (anoMod < anoFab || anoMod > anoFab + 1) {
          alert(
            "Ano do modelo deve ser igual ou no máximo 1 ano a mais que o ano de fabricação."
          );
          return;
        }
      }
      if (this.etapa < 3) this.etapa++;
    },
    voltarEtapa() {
      if (this.etapa > 1) this.etapa--;
    },
    formatarKm() {
      if (!this.anuncio.km) {
        this.anuncio.km = "";
        return;
      }

      let numeroLimpo = this.anuncio.km.replace(/\D/g, "");
      if (!numeroLimpo) {
        this.anuncio.km = "";
        return;
      }

      this.anuncio.km = new Intl.NumberFormat("pt-BR").format(parseInt(numeroLimpo, 10));
    },
    async atualizarStatusLimite() {
      try {
        if (!this.usuarioId) {
          this.diasParaLiberar = 0;
          this.anunciosRestantes = 5;
          return;
        }
        const anunciosResp = await anuncioApi.get(`/usuario/${this.usuarioId}/recentes`);
        const anunciosRecentes = anunciosResp.data;

        if (anunciosRecentes.length < 5) {
          this.diasParaLiberar = 0;
          this.anunciosRestantes = 5 - anunciosRecentes.length;
          return;
        }

        const datasCriacao = anunciosRecentes.map(a => new Date(a.dataCriacao));
        const maisAntiga = new Date(Math.min.apply(null, datasCriacao));

        const hoje = new Date();
        const limite = new Date(maisAntiga.getTime() + 30 * 24 * 60 * 60 * 1000);

        const diffMs = limite - hoje;
        const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDias > 0) {
          this.diasParaLiberar = diffDias;
          this.anunciosRestantes = 0;
        } else {
          this.diasParaLiberar = 0;
          this.anunciosRestantes = 1;
        }
      } catch (error) {
        console.error("Erro ao atualizar status limite:", error);
        this.diasParaLiberar = 0;
        this.anunciosRestantes = 5;
      }
    },
    async finalizarAnuncio() {
  try {
    if (!this.usuarioId) {
      alert("Informe o ID do usuário.");
      return;
    }

    await this.atualizarStatusLimite();

    if (this.anunciosRestantes === 0) {
      alert(`Você atingiu o limite de 5 anúncios. Aguarde ${this.diasParaLiberar} dia(s) para criar novos.`);
      return;
    }

    if (!this.anuncio.imagens.some(img => img.trim() !== "")) {
      alert("Adicione pelo menos uma imagem.");
      return;
    }

    let precoFormatado = this.anuncio.preco.replace(/\./g, "").replace(",", ".");
    const precoLimpo = parseFloat(precoFormatado);

    if (isNaN(precoLimpo)) {
      alert("Preço inválido, corrija o valor.");
      return;
    }

    const dadosEnvio = {
      tipoVeiculo: this.anuncio.tipoVeiculo,
      marca: this.anuncio.marca.trim(),
      modelo: this.anuncio.modelo.trim(),
      preco: precoLimpo,
      anoFabricacao: parseInt(this.anuncio.anoFabricacao),
      anoModelo: parseInt(this.anuncio.anoModelo),
      km: parseInt(this.anuncio.km),
      cor: this.anuncio.cor.trim(),
      categoria: this.anuncio.categoria.trim(),
      cambio: this.anuncio.cambio.trim(),
      combustivel: this.anuncio.combustivel.trim(),
      descricao: this.anuncio.descricao.trim(),
      opcionais: this.anuncio.opcionais || [],
      imagens: this.anuncio.imagens.filter(img => img.trim() !== ""),
    };

    await anuncioApi.post(`/usuario/${this.usuarioId}`, dadosEnvio);

    alert("Anúncio criado com sucesso!");
    this.$router.push({ name: "TelaAnuncios" });

  } catch (error) {
  console.error("Erro ao criar anúncio:", error);

  let msg = "Erro ao criar anúncio. Tente novamente.";

  // Tenta pegar a mensagem da resposta do backend
  if (error.response) {
    console.log("Response status:", error.response.status);
    console.log("Response data:", error.response.data);

    if (error.response.status === 403) {
      if (error.response.data) {
        if (typeof error.response.data === "string") {
          msg = error.response.data;
        } else if (typeof error.response.data === "object") {
          // Tenta campos comuns
          msg = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
        }
      }
    } else {
      // Outros erros, tenta exibir dados da resposta
      msg = JSON.stringify(error.response.data);
    }
  } else if (error.message) {
    msg = error.message;
  }

  alert(msg);
}



    }
  }}
;
</script>

<style scoped>
.opcionais {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.opcional {
  padding: 10px;
  border: 1px solid #94077f;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.opcional.active {
  background-color: #5b3199;
  color: white;
  border-color: #5b3199;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f3f3f3;
}

.container {
  max-width: 1300px;
  margin: 20px auto;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
}

.content {
  text-align: center;
}

h2 {
  color: #5b3199;
  margin-bottom: 20px;
  font-size: 40px;
  margin-left: 90px;
}

h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 30px;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.input-valor {
  font-size: 18px;
  padding: 12px;
}

.upload-box {
  margin-top: 20px;
  padding: 10px;
}

.btn-adicionar {
  background-color: #531b76;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-container input {
  width: 100%;
  padding-right: 35px;
  box-sizing: border-box;
}

.remove-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  transition: transform 0.2s, color 0.3s ease;
}

.remove-btn i {
  color: #ff4d4d;
  font-size: 20px;
}

.remove-btn:hover i {
  color: #d11a2a;
  transform: scale(1.2);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-next,
.btn-finish {
  margin-left: auto;
}

.btn-next {
  background-color: #5b3199;
  color: white;
}

.btn-back {
  background-color: #ccc;
}

.btn-finish {
  background-color: #28a745;
  color: white;
}

@media (max-width: 600px) {
>>>>>>> main
  .container {
    width: 90%;
  }

  .form {
    grid-template-columns: 1fr;
  }
}
</style>
