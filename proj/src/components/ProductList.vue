<template>
  <div class="product-list">
    <h1>Nos Jeux</h1>

    <div v-if="addToCartMessage" class="success-message">
      {{ addToCartMessage }}
    </div>

    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Rechercher un jeu par nom..." 
      class="search-bar"
    />

    <div v-if="filteredProducts.length === 0">Aucun jeu trouvé...</div>
    
    <div v-else class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id_jeu" class="product-item">
        <img :src="`/images/${product.image}`" alt="Product Image" />
        <h2>{{ product.nom_jeu }}</h2>
        <p>{{ product.description_jeu }}</p>
        <p>Éditeur : {{ product.editeur }}</p>
        <p>Âge minimum : {{ product.minage }} ans</p>
        <p>Année de publication : {{ product.yearpublished }}</p>

        <button v-if="isAuthenticated" @click="addToCart(product)">Ajouter au panier</button>
        <button v-else disabled>Connectez-vous pour ajouter</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      searchQuery: '',
      addToCartMessage: '',
    };
  },
  computed: {
    ...mapState(['products', 'isAuthenticated']),
    filteredProducts() {
      return this.products.filter(product => {
        return product.nom_jeu.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    ...mapActions(['fetchProducts', 'addToCart']),
    async addToCart(product) {
      await this.$store.dispatch('addToCart', product);
      this.addToCartMessage = `${product.nom_jeu} ajouté au panier`;
      setTimeout(() => {
        this.addToCartMessage = '';
      }, 3000);
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style>
.product-list {
  padding: 20px;
}

.success-message {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: opacity 0.5s ease-in-out;
}

.search-bar {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.product-item {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  background: #fff;
}

.product-item img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.product-item button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.product-item button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.product-item button:disabled {
  background-color: #ddd;
  color: #888;
  cursor: not-allowed;
}

.product-item button:disabled:hover {
  background-color: #ddd;
  transform: none;
}
</style>
