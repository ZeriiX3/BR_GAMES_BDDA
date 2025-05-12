<template>
  <div class="product-list">
    <h1>Our Products</h1>

    <!-- Success Message for adding product to cart -->
    <div v-if="addToCartMessage" class="success-message">
      {{ addToCartMessage }}
    </div>

    <!-- Search bar -->
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search products by name..." 
      class="search-bar"
    />

    <div v-if="filteredProducts.length === 0">No products found...</div>
    
    <div v-else class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-item">
        <img :src="`/images/${product.image}`" alt="Product Image" />
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <p>Price: {{ product.price }} €</p>
        <p>Rating: {{ product.rating }} / 5</p>

        <button v-if="isAuthenticated" @click="addToCart(product)">Add to Cart</button>
        <button v-else disabled>Please log in to add to cart</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      searchQuery: '', // To hold the user's search input
      addToCartMessage: '', // To display the success message when a product is added
    };
  },
  computed: {
    ...mapState(['products', 'isAuthenticated']), // Access products and isAuthenticated from Vuex state
    
    // Filter products based on the search query
    filteredProducts() {
      return this.products.filter(product => {
        return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    ...mapActions(['fetchProducts', 'addToCart']), // Fetch products and add to cart action
    
    // Custom method to handle add to cart with success message
    async addToCart(product) {
      await this.$store.dispatch('addToCart', product); // Add product to cart
      this.addToCartMessage = `${product.name} added to the cart!`; // Set success message
      setTimeout(() => {
        this.addToCartMessage = ''; // Hide the message after 3 seconds
      }, 3000);
    },
  },
  created() {
    this.fetchProducts(); // Fetch products when the component is created
  },
};
</script>

<style>
.product-list {
  padding: 20px;
}

/* Success Message Styling */
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
  background-color: #007bff; /* Blue background for 'Add to Cart' */
  color: white;
  border: none;
  padding: 12px 25px; /* Increased padding for a more prominent button */
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth hover effect */
}

.product-item button:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: scale(1.05); /* Slight zoom effect on hover */
}

.product-item button:disabled {
  background-color: #ddd; /* Light gray for disabled button */
  color: #888; /* Darker gray text for better readability */
  cursor: not-allowed;
}

.product-item button:disabled:hover {
  background-color: #ddd; /* Keep the same color when disabled */
  transform: none; /* Remove hover effect for disabled button */
}
</style>
