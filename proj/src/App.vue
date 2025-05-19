<template>
  <div id="app">
    <header>
      <nav class="navbar">
        <div class="logo">BR GAMES</div>
        <ul class="nav-links">
          <li><router-link to="/">Accueil</router-link></li>
          <li><router-link to="/products">Produits</router-link></li>

          <li v-if="estAuthentifie"><router-link to="/offres">Offres</router-link></li>

          <li v-if="estAuthentifie && roleUtilisateur === 'admin'">
            <router-link to="/manage-products">Gérer les produits</router-link>
          </li>

          <li v-if="estAuthentifie && roleUtilisateur === 'admin'">
            <router-link to="/manage-users">Gérer les utilisateurs</router-link>
          </li>

          <li v-if="!estAuthentifie"><router-link to="/login">Connexion</router-link></li>

          <li v-else><button @click="seDeconnecter">Déconnexion</button></li>
        </ul>
      </nav>
    </header>

    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState({
      estAuthentifie: 'isAuthenticated',
      roleUtilisateur: 'userRole',
    }),
  },
  methods: {
    ...mapActions({
      deconnexion: 'logout',
    }),
    async seDeconnecter() {
      await this.deconnexion();
      this.$router.push('/');
    },
  },
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links li {
  display: inline;
}

.nav-links a,
.nav-links button {
  color: white;
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;
  background: none;
  border: none;
}

.nav-links a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

.nav-links a:hover,
.nav-links button:hover {
  color: #007bff;
}
</style>
