<template>
  <div>
    <Navbar />
    <h2>Editar Anúncio</h2>
    <div class="container">

      <!-- Etapa 1: Dados básicos -->
      <div v-if="etapa === 1" class="content">
        <h3>Edite as informações do veículo</h3>
        <div class="form">
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
            <input
              type="text"
              v-model="anuncio.km"
              placeholder="Digite a quilometragem"
              @input="formatarKm"
            />
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
          <button class="btn-back" @click="voltarEtapa" v-if="etapa > 1">Voltar</button>
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
        <h3>Editar fotos do veículo</h3>
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
          <button class="btn-finish" @click="salvarAlteracoes">Salvar Alterações</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { anuncioApi } from "../Services/http.js";

export default {
  name: "TelaEditarAnuncio",
  components: { Navbar },
  props: ['id'],
  data() {
    return {
      anuncioId: "",
      anuncio: {
        tipoVeiculo: "",
        marca: "",
        modelo: "",
        preco: "",
        anoFabricacao: "",
        anoModelo: "",
        km: "",
        cor: "",
        categoria: "",
        cambio: "",
        combustivel: "",
        descricao: "",
        opcionais: [],
        imagens: [""],
      },
      anuncioIdInformado: false,
      etapa: 1,
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
    };
  },
  mounted() {
    const idDaRota = this.$route.params.id;
    if (idDaRota) {
      this.anuncioId = idDaRota;
      this.buscarAnuncio();
    }
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
    adicionarImagem() {
      if (this.anuncio.imagens.length < 10) this.anuncio.imagens.push("");
    },
    removerImagem(index) {
      this.anuncio.imagens.splice(index, 1);
    },
    toggleOpcional(opcional) {
      const idx = this.anuncio.opcionais.indexOf(opcional);
      if (idx === -1) this.anuncio.opcionais.push(opcional);
      else this.anuncio.opcionais.splice(idx, 1);
    },
    avancarEtapa() {
      if (this.etapa === 1) {
        const camposObrigatorios = [
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
          const valor = this.anuncio[campo];
          if (valor === undefined || valor === null) {
            alert(`Por favor, preencha o campo obrigatório: ${campo}`);
            return;
          }
          if (typeof valor === "string" && valor.trim() === "") {
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
          alert("Ano do modelo deve ser igual ou no máximo 1 ano a mais que o ano de fabricação.");
          return;
        }
      }
      if (this.etapa < 3) this.etapa++;
    },
    voltarEtapa() {
      if (this.etapa > 1) this.etapa--;
    },
    async buscarAnuncio() {
      try {
        const response = await anuncioApi.get(`/${this.id}`);
        this.anuncio = response.data;

        if (!this.anuncio.imagens || this.anuncio.imagens.length === 0)
          this.anuncio.imagens = [""];
        if (!this.anuncio.opcionais)
          this.anuncio.opcionais = [];

        if (typeof this.anuncio.preco === "number") {
          this.anuncio.preco = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(this.anuncio.preco);
        }

        if (this.anuncio.km !== null && this.anuncio.km !== undefined) {
          this.anuncio.km = String(this.anuncio.km);
          this.formatarKm();
        } else {
          this.anuncio.km = "";
        }

        if (!this.anuncio.usuario)
          this.anuncio.usuario = null;

      } catch (error) {
        console.error("Erro ao buscar anúncio:", error);
        alert("Erro ao buscar o anúncio.");
      }
    },
    async salvarAlteracoes() {
      try {
        let precoLimpo = this.anuncio.preco;
        if (typeof precoLimpo === "string") {
          precoLimpo = precoLimpo.replace(/\./g, "").replace(",", ".");
          precoLimpo = parseFloat(precoLimpo);
          if (isNaN(precoLimpo)) {
            alert("Preço inválido. Corrija o valor.");
            return;
          }
        }
        const dadosEnvio = {
          tipoVeiculo: this.anuncio.tipoVeiculo,
          marca: this.anuncio.marca.trim(),
          modelo: this.anuncio.modelo.trim(),
          preco: precoLimpo,
          anoFabricacao: parseInt(this.anuncio.anoFabricacao),
          anoModelo: parseInt(this.anuncio.anoModelo),
          km: this.anuncio.km ? this.anuncio.km.replace(/\./g, "") : null,
          cor: this.anuncio.cor.trim(),
          categoria: this.anuncio.categoria.trim(),
          cambio: this.anuncio.cambio.trim(),
          combustivel: this.anuncio.combustivel.trim(),
          descricao: this.anuncio.descricao.trim(),
          opcionais: this.anuncio.opcionais || [],
          imagens: this.anuncio.imagens.filter((img) => img.trim() !== ""),
          usuario: this.anuncio.usuario ? { id: this.anuncio.usuario.id } : null,
        };
        console.log("ID do anúncio para edição:", this.anuncioId);
        await anuncioApi.put(`/${this.anuncioId}`, dadosEnvio);
        alert("Anúncio editado com sucesso!");
        this.$router.push({ name: "TelaAnuncios" });
      } catch (error) {
        console.error("Erro ao editar anúncio:", error);
        alert("Erro ao editar o anúncio. Tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
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
  .container {
    width: 90%;
  }

  .form {
    grid-template-columns: 1fr;
  }
}
</style>
