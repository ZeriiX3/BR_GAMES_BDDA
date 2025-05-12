<template>
  <div class="auth-container">
    <h2>Authentication</h2>

    <!-- Show success or error message -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <!-- Login form -->
    <div v-if="mode === 'login'">
      <h3>Login</h3>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p @click="switchMode">Create an account</p>
    </div>

    <!-- Sign-up form -->
    <div v-else>
      <h3>Create an account</h3>
      <form @submit.prevent="signup">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p @click="switchMode">Login</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex'; // to interact with Vuex store

export default {
  data() {
    return {
      mode: 'login',  // Default to login page
      username: '',
      password: '',
      message: '',  // Message for success or error
      messageType: '',  // 'success' or 'error' for message styling
    };
  },
  methods: {
    // Login user
    async login() {
  try {

    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: this.username,
      password: this.password,

    });

    // Store the token in localStorage (optional for persistent login)
    localStorage.setItem('token', response.data.token); 

    // Dispatch login action to update the Vuex store with user role
    this.$store.dispatch('login', { username: this.username, role: response.data.role });

    // Redirect to home after successful login
    this.$router.push('/');

    // Show success message
    this.showMessage('Successfully logged in!', 'success');
  } catch (error) {
    console.error('Login error:', error.response.data);
    this.showMessage(error.response.data.message, 'error');  // Show error message
  }
},

    // Register user
    async signup() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username: this.username,
          password: this.password,
        });

        // Switch to login mode after successful signup
        this.mode = 'login'; 
        this.showMessage('Account created successfully! Please log in.', 'success');
      } catch (error) {
        // Show error message if signup fails
        console.error('Signup error:', error.response.data);
        this.showMessage(error.response.data.message, 'error');
      }
    },

    // Switch between login and signup forms
    switchMode() {
      this.mode = this.mode === 'login' ? 'signup' : 'login';
    },

    // Show success or error message
    showMessage(message, type) {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';  // Clear message after 3 seconds
      }, 3000);
    },
  },
};
</script>

<style>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
}
.auth-container h2 {
  text-align: center;
}

.message {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  transition: opacity 0.5s;
}

.message.success {
  background-color: #28a745;  /* Green for success */
  color: white;
}

.message.error {
  background-color: #ff4d4d;  /* Red for error */
  color: white;
}

.auth-container input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.auth-container button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.auth-container p {
  text-align: center;
  cursor: pointer;
  color: #007bff;
}
</style>
