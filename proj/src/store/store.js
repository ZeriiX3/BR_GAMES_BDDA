import { createStore } from 'vuex';
import axios from 'axios';
import { API_URL } from '@/api';

const store = createStore({
  state: {
    products: [],
    cart: [],
    pendingOffers: [],
    isAuthenticated: false,
    userRole: '',
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setAuthentication(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.userRole = payload.userRole;
    },
    addToCart(state, product) {
      const existingProduct = state.cart.find(item => item.id_jeu === product.id_jeu);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter(item => item.id_jeu !== productId);
    },
    clearCart(state) {
      state.cart = [];
    },
    addPendingOffer(state, product) {
      const already = state.pendingOffers.find(p => p.id_jeu === product.id_jeu);
      if (!already) state.pendingOffers.push(product);
    },
    removePendingOffer(state, productId) {
      state.pendingOffers = state.pendingOffers.filter(p => p.id_jeu !== productId);
    },
    clearPendingOffers(state) {
      state.pendingOffers = [];
    }
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/jeux`);
        commit('setProducts', response.data);
      } catch (error) {
        console.error('Error fetching jeux:', error.message);
      }
    },
    login({ commit }, userData) {
      commit('setAuthentication', { isAuthenticated: true, userRole: userData.role });
    },
    logout({ commit }) {
      commit('setAuthentication', { isAuthenticated: false, userRole: '' });
      commit('clearCart');
      commit('clearPendingOffers');
    },
    addToCart({ commit }, product) {
      commit('addToCart', product);
    },
    removeFromCart({ commit }, productId) {
      commit('removeFromCart', productId);
    },
    addPendingOffer({ commit }, product) {
      commit('addPendingOffer', product);
    },
    removePendingOffer({ commit }, productId) {
      commit('removePendingOffer', productId);
    }
  },
  getters: {
    getProducts(state) {
      return state.products;
    },
    getCart(state) {
      return state.cart;
    },
    getPendingOffers(state) {
      return state.pendingOffers;
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
