<template>
  <div class="manage-product">
    <!-- Success/Error Message -->
    <div v-if="message" :class="['message', messageType]">{{ message }}</div>

    <h1>Manage Products</h1>

    <!-- Button to toggle Add Product form -->
    <button @click="showAddForm = !showAddForm">Add New Product</button>

    <!-- Conditionally show the Add Product form -->
    <div v-if="showAddForm">
      <h3>Add New Product</h3>
      <form @submit.prevent="submitProduct">
        <input v-model="product.name" type="text" placeholder="Product Name" required />
        <input v-model="product.description" type="text" placeholder="Product Description" required />
        <input v-model="product.price" type="number" placeholder="Price" required />
        <input v-model="product.rating" type="number" placeholder="Rating" step="0.1" min="0" max="5" required />
        <input v-model="product.stock" type="number" placeholder="Stock" required />
        <input type="file" @change="handleImageUpload" required />
        <button type="submit">Save Product</button>
      </form>
    </div>

    <!-- Product list display -->
    <div class="product-grid">
      <div v-if="products.length === 0">No products available.</div>
      <div v-else class="product-item" v-for="product in products" :key="product.id">
        <img :src="`/images/${product.image}`" alt="Product Image" />
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <p>Price: {{ product.price }} €</p>
        <p>Stock: {{ product.stock }}</p>
        <p>Rating: {{ product.rating }} / 5</p>
        <button @click="removeProduct(product.id)">Remove Product</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: 'ManageProduct',
  data() {
    return {
      showAddForm: false, // Toggle visibility of the form
      product: {
        name: '',
        description: '',
        price: 0,
        rating: 0,
        stock: 0,
        image: null,
      },
      message: '',  // Message to be shown to the user
      messageType: '',  // Type of message (success or error)
    };
  },
  computed: {
    ...mapState(['products']),  // Fetch products from Vuex store
  },
  methods: {
    // Show success or error message
    showMessage(message, type) {
      this.message = message;
      this.messageType = type;  // Set class based on message type (success/error)
      setTimeout(() => {
        this.message = '';  // Hide message after 3 seconds
      }, 3000);
    },

    // Submit product to the database
    async submitProduct() {
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price);
      formData.append('rating', this.product.rating);
      formData.append('stock', this.product.stock);
      formData.append('image', this.product.image);  // Attach the image file

      try {
        const response = await axios.post('http://localhost:3000/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.showMessage('Product added successfully!', 'success');
        this.showAddForm = false;  // Hide form after successful product creation
        this.$store.dispatch('fetchProducts');  // Refresh product list after adding
      } catch (error) {
        console.error('Error adding product:', error);
        this.showMessage('Failed to add product.', 'error');
      }
    },

    // Handle image file input
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.product.image = file; // Store the selected file
      }
    },

    // Remove product from database
    async removeProduct(productId) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${productId}`);
        this.showMessage('Product removed successfully!', 'success');
        this.$store.dispatch('fetchProducts');  // Refresh product list after deletion
      } catch (error) {
        console.error('Error removing product:', error);
        this.showMessage('Failed to remove product.', 'error');
      }
    },
  },
};
</script>

<style scoped>
.manage-product {
  padding: 20px;
}

.message {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
}

.message.success {
  background-color: #28a745;
  color: white;
}

.message.error {
  background-color: #dc3545;
  color: white;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.product-item {
  border: 1px solid #ddd;
  padding: 15px;
  background: #fff;
  text-align: center;
  border-radius: 5px;
}

.product-item img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

input[type="file"] {
  margin-bottom: 10px;
}

form input {
  margin: 5px;
  padding: 10px;
  width: 200px;
  margin-bottom: 10px;
}

form button {
  margin-top: 10px;
}
</style>
