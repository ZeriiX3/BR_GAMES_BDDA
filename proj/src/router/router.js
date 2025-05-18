import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/store.js';
import Home from '../components/Home.vue';
import ProductList from '../components/ProductList.vue';
import Cart from '../components/Cart.vue';
import ManageProduct from '../components/ManageProduct.vue';
import Login from '../components/Login.vue';
import ManageUsers from '../components/ManageUsers.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/manage-products', component: ManageProduct, meta: { requiresAdmin: true } },
  { path: '/manage-users', component: ManageUsers, meta: { requiresAdmin: true } }, 
  { path: '/login', component: Login, meta: { requiresGuest: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.isAuthenticated;
  const userRole = store.state.userRole;

  if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated) {
    next('/');
  } else if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else if (to.matched.some(record => record.meta.requiresAdmin) && userRole !== 'admin') {
    next('/');
  } else {
    next();
  }
});

export default router;
