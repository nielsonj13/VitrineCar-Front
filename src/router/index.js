import { createRouter, createWebHistory } from 'vue-router';
import TelaPrincipal from '@/views/TelaPrincipal.vue';
import TelaResultados from '@/views/TelaResultados.vue';

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

  ],
});

export default router;
