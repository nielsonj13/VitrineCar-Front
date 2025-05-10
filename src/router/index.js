import { createRouter, createWebHistory } from 'vue-router';
import TelaPrincipal from '@/views/TelaPrincipal.vue';
import TelaResultados from '@/views/TelaResultados.vue';
import TelaAnuncios from '@/views/TelaAnuncios.vue';
import TelaCriarAnuncios from '@/views/TelaCriarAnuncios.vue';
import TelaEditarAnuncios from '@/views/TelaEditarAnuncios.vue';
import TelaMeusAnuncios from '@/views/TelaMeusAnuncios.vue';

// https://vitrinecar-71a27.web.app

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TelaPrincipal',
      component: TelaPrincipal,
    },
    {
      path: '/resultados',
      name: 'TelaResultados',
      component: TelaResultados,
    },
    {
      path: '/anuncios',
      name: 'TelaAnuncios',
      component: TelaAnuncios,
    },
    {
      path: '/criaranuncio',
      name: 'TelaCriarAnuncios',
      component: TelaCriarAnuncios,
    },
    {
      path: '/editaranuncio',
      name: 'TelaEditarAnuncios',
      component: TelaEditarAnuncios,
    },
    {
      path: '/meusanuncio',
      name: 'TelaMeusAnuncios',
      component: TelaMeusAnuncios,
    },

  ],
});

export default router;
