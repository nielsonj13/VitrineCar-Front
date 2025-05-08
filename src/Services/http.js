import axios from 'axios';

// API para Usuários
const usuarioApi = axios.create({
  baseURL: 'http://localhost:8080/usuarios',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API para Anúncios
const anuncioApi = axios.create({
  baseURL: 'http://localhost:8080/anuncios',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { usuarioApi, anuncioApi };
