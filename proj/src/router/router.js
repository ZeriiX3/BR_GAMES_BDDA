import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/store.js'; // Import store to check authentication status
import Home from '../components/Home.vue';
import ProductList from '../components/ProductList.vue';
import Cart from '../components/Cart.vue';
import ManageProduct from '../components/ManageProduct.vue';
import Login from '../components/Login.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  {
    path: '/cart',
    component: Cart,
    meta: { requiresAuth: true }, // Requires authentication
  },
  {
    path: '/manage-products',
    component: ManageProduct,
    meta: { requiresAdmin: true }, // Requires admin role
  },
  { path: '/login', component: Login, meta: { requiresGuest: true } }, // Login page
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to check authentication and role
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.isAuthenticated; // Get the authentication status
  const userRole = store.state.userRole; // Get the user role (e.g., admin, user)
  // Redirect to home if logged in and trying to access login/register page
  if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated) {
    next('/'); // Redirect to homepage if already logged in
  }
  // Check if the route requires authentication
  else if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); // Redirect to login if not authenticated
  } 
  // Check if the route requires admin role
  else if (to.matched.some(record => record.meta.requiresAdmin) && userRole !== 'admin') {
    next('/'); // Redirect to home if not an admin
  } else {
    next(); // Allow navigation
  }
});


export default router;
