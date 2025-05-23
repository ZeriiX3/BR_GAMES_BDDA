<template>
  <div class="auth-container">
    <h2>Authentification</h2>

    <!-- Message d'information admin -->
    <div class="info-message">
      Pour gérer les produits et les utilisateurs, vous devez avoir un compte administrateur.
    </div>

    <!-- Message de succès ou d'erreur -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <!-- Formulaire de connexion -->
    <div v-if="mode === 'login'">
      <h3>Connexion</h3>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
      <p @click="switchMode">Vous n'avez pas de compte ? Créez-en un</p>
    </div>

    <!-- Formulaire d'inscription -->
    <div v-else>
      <h3>Créer un compte</h3>
      <form @submit.prevent="signup">
        <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <button type="submit">S'inscrire</button>
      </form>
      <p @click="switchMode">Vous avez déjà un compte ? Connectez-vous</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/api';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      mode: 'login',
      username: '',
      password: '',
      message: '',
      messageType: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          username: this.username,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);

        this.$store.dispatch('login', { username: this.username, role: response.data.role });

        this.$router.push('/');

        this.showMessage('Connexion réussie !', 'success');
      } catch (error) {
        console.error('Erreur de connexion :', error.response?.data || error.message);
        this.showMessage(error.response?.data?.message || 'Échec de la connexion.', 'error');
      }
    },

    async signup() {
      try {
        await axios.post(`${API_URL}/auth/register`, {
          username: this.username,
          password: this.password,
        });

        this.mode = 'login';
        this.showMessage('Compte créé avec succès ! Veuillez vous connecter.', 'success');
      } catch (error) {
        console.error('Erreur d’inscription :', error.response?.data || error.message);
        this.showMessage(error.response?.data?.message || "Échec de l'inscription.", 'error');
      }
    },

    switchMode() {
      this.mode = this.mode === 'login' ? 'signup' : 'login';
    },

    showMessage(message, type) {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },
  },
};
</script>

<style>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 15px;
  background: #fafafa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.auth-container h2 {
  text-align: center;
  margin-bottom: 10px;
}
.auth-container h3 {
  text-align: center;
  margin-bottom: 20px;
}

.info-message {
  background-color: #e7f3fe;
  color: #31708f;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
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
  background-color: #28a745;
  color: white;
}

.message.error {
  background-color: #ff4d4d;
  color: white;
}

.auth-container input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
}
.auth-container button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.auth-container button:hover {
  background-color: #0056b3;
}
.auth-container p {
  text-align: center;
  cursor: pointer;
  color: #007bff;
  margin-top: 15px;
  font-size: 14px;
}
.auth-container p:hover {
  text-decoration: underline;
}
</style>
