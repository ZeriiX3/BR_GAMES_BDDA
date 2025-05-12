import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    products: [],
    cart: [],  // Store cart items
    isAuthenticated: false, // Track if user is logged in
    userRole: '', // Track user role ('admin' or 'user')
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setAuthentication(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.userRole = payload.userRole; // Update userRole on login
    },
    addToCart(state, product) {
      const existingProduct = state.cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity++; // Increase quantity if product is already in cart
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId);
    },
    clearCart(state) {
      state.cart = []; // Clear the cart on logout
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        commit('setProducts', response.data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    },
    login({ commit }, userData) {
      commit('setAuthentication', { isAuthenticated: true, userRole: userData.role });
    },
    logout({ commit }) {
      commit('setAuthentication', { isAuthenticated: false, userRole: '' });
      commit('clearCart'); // Clear cart on logout
    },
    addToCart({ commit }, product) {
      commit('addToCart', product);
    },
    removeFromCart({ commit }, productId) {
      commit('removeFromCart', productId);
    },
  },
  getters: {
    getProducts(state) {
      return state.products;
    },
    getCart(state) {
      return state.cart;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    userRole(state) {
      return state.userRole;
    },
  },
});

export default store;
