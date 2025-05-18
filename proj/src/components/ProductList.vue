<template>
  <div class="product-list">
    <h1>Nos Jeux</h1>

    <!-- Message de succès -->
    <div v-if="addToCartMessage" class="success-message">
      {{ addToCartMessage }}
    </div>

    <!-- Barre de recherche -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Rechercher un jeu par nom..."
      class="search-bar"
    />

    <!-- Filtres boutons -->
    <div class="filters">
      <button @click="appliquerFiltre('recents')">Jeux récents</button>
      <button @click="appliquerFiltre('bien-notes')">Jeux bien notés</button>
      <button @click="chargerProduits">Réinitialiser</button>
    </div>

    <!-- Sélecteur de catégorie -->
    <div class="categorie-filter">
      <label for="categorie-select">Filtrer par catégorie :</label>
      <select id="categorie-select" v-model="selectedCategorie" @change="appliquerCategorie">
        <option disabled value="">-- Choisissez une catégorie --</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <!-- Aucun produit -->
    <div v-if="filteredProducts.length === 0">
      Aucun jeu trouvé...
    </div>

    <!-- Grille produits -->
    <div v-else class="product-grid">
      <div v-for="jeu in filteredProducts" :key="jeu.id_jeu" class="product-item">
        <img :src="`/images/${jeu.image_jeu || 'placeholder.png'}`" alt="Image jeu" />

        <h2>{{ jeu.nom_jeu }}</h2>
        <p>{{ jeu.description_jeu }}</p>
        <p>Éditeur : {{ jeu.editeur }}</p>
        <p>Âge minimum : {{ jeu.minage }} ans</p>
        <p>Année de publication : {{ jeu.yearpublished }}</p>

        <button 
          v-if="isAuthenticated" 
          @click="handleAddToCart(jeu)"
        >
          Ajouter au panier
        </button>
        <button v-else disabled>Connectez-vous pour ajouter</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductList',
  data() {
    return {
      produits: [],
      produitsFiltres: [],
      categories: [],
      selectedCategorie: '',
      searchQuery: '',
      addToCartMessage: ''
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    filteredProducts() {
      return this.produitsFiltres.filter(p =>
        p.nom_jeu.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    ...mapActions(['addToCart']),
    async handleAddToCart(produit) {
      this.addToCart(produit);
      this.addToCartMessage = `${produit.nom_jeu} ajouté au panier !`;
      setTimeout(() => {
        this.addToCartMessage = '';
      }, 3000);
    },
    async chargerProduits() {
      try {
        const res = await axios.get('http://localhost:3000/api/jeux');
        this.produits = res.data;
        this.produitsFiltres = res.data;
        this.selectedCategorie = '';
      } catch (err) {
        console.error('Erreur de chargement des jeux :', err);
      }
    },
    async appliquerFiltre(type) {
      let url = 'http://localhost:3000/api/jeux';
      if (type === 'recents') url += '/recents';
      else if (type === 'bien-notes') url += '/bien-notes';

      try {
        const res = await axios.get(url);
        this.produitsFiltres = res.data;
        this.selectedCategorie = '';
      } catch (err) {
        console.error('Erreur filtre :', err);
      }
    },
    async chargerCategories() {
      try {
        const res = await axios.get('http://localhost:3000/api/jeux/categories');
        this.categories = res.data.map(c => c.nom_cat);
      } catch (err) {
        console.error('Erreur chargement catégories :', err);
      }
    },
    async appliquerCategorie() {
      if (!this.selectedCategorie) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/jeux/categorie/${encodeURIComponent(this.selectedCategorie)}`);
        this.produitsFiltres = res.data;
      } catch (err) {
        console.error('Erreur filtre catégorie :', err);
      }
    }
  },
  mounted() {
    this.chargerProduits();
    this.chargerCategories();
  }
};
</script>

<style scoped>
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
}

.search-bar {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.filters {
  margin-bottom: 15px;
}

.filters button {
  margin-right: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filters button:hover {
  background-color: #0056b3;
}

.categorie-filter {
  margin-bottom: 20px;
}

.categorie-filter select {
  padding: 6px;
  font-size: 16px;
  margin-left: 10px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
}

.product-item button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.product-item button:hover {
  background-color: #0056b3;
}

.product-item button:disabled {
  background-color: #ddd;
  color: #888;
  cursor: not-allowed;
}
</style>
