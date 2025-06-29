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

// API para Denúncias
const denunciaApi = axios.create({
  baseURL: 'http://localhost:8080/denuncias',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API para Favoritos
const favoritoApi = axios.create({
  baseURL: 'http://localhost:8080/favoritos',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(config => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Basic ${token}`;
    }
    return config;
  });
};

addAuthInterceptor(usuarioApi);
addAuthInterceptor(anuncioApi);
addAuthInterceptor(denunciaApi);
addAuthInterceptor(favoritoApi);

export { usuarioApi, anuncioApi, denunciaApi, favoritoApi };
