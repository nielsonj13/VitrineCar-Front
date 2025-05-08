import axios from 'axios';

// API para Usuários
const usuarioApi = axios.create({
  baseURL: 'http://localhost:8080/api/Usuario',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API para Anúncios
const anuncioApi = axios.create({
  baseURL: 'http://localhost:8080/api/Anuncio',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { usuarioApi, anuncioApi };
