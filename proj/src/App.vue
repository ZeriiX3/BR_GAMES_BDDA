<template>
  <div id="app">
    <header>
      <nav class="navbar">
        <div class="logo">PARFUMERIE BABASSE</div>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/products">Products</router-link></li>

          <li v-if="isAuthenticated"><router-link to="/cart">Cart</router-link></li>

          <li v-if="isAuthenticated && userRole === 'admin'">
            <router-link to="/manage-products">Manage Product</router-link>
          </li>

          <li v-if="isAuthenticated && userRole === 'admin'">
            <router-link to="/manage-users">Manage Users</router-link>
          </li>

          <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>

          <li v-else><button @click="handleLogout">Logout</button></li>
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
    ...mapState(['isAuthenticated', 'userRole']),
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout(); 
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
