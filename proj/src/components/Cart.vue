<template>
  <div class="cart-container">
    <h1>Your Cart</h1>

    <!-- Check if cart is empty -->
    <div v-if="cart.length === 0" class="empty-cart-message">
      Your cart is empty. Add some products to it!
    </div>
    
    <!-- Display cart items -->
    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <div class="cart-item-details">
          <img :src="`/images/${item.image}`" alt="Product Image" class="cart-item-image" />
          <div class="cart-item-info">
            <h3>{{ item.name }}</h3>
            <p>Price: €{{ item.price }}</p>
            <p>Quantity: {{ item.quantity }}</p>
          </div>
        </div>
        <button @click="removeFromCart(item.id)" class="remove-item">Remove</button>
      </div>

      <!-- Cart total -->
      <div class="cart-total">
        <strong>Total: €{{ totalPrice }}</strong>
      </div>

      <!-- Option to proceed to checkout -->
      <button class="checkout-btn">Proceed to Checkout</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Cart',
  computed: {
    ...mapState(['cart']),
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  methods: {
    ...mapActions(['removeFromCart']), // Ensure the removeFromCart action is mapped
  },
};
</script>

<style>
.cart-container {
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

.cart-item-details {
  display: flex;
  align-items: center;
}

.cart-item-image {
  width: 80px;  /* Small product image */
  height: auto;
  margin-right: 20px;
}

.cart-item-info {
  flex: 1;
}

.cart-item h3 {
  font-size: 18px;
  margin: 0;
}

.cart-item p {
  margin: 5px 0;
  font-size: 16px;
}

.remove-item {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.remove-item:hover {
  background-color: #ff1a1a;
}

.cart-total {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.checkout-btn:hover {
  background-color: #218838;
}

.empty-cart-message {
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-top: 20px;
}
</style>
