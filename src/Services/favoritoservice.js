import { favoritoApi } from './http';

export default {
  favoritar(usuarioId, anuncioId) {
    return favoritoApi.post(`/usuario/${usuarioId}/anuncio/${anuncioId}`);
  },
  desfavoritar(usuarioId, anuncioId) {
    return favoritoApi.delete(`/usuario/${usuarioId}/anuncio/${anuncioId}`);
  },
  listarFavoritos(usuarioId) {
    return favoritoApi.get(`/usuario/${usuarioId}`);
  }
};
