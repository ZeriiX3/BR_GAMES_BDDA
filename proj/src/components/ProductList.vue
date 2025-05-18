<template>
  <div class="product-list">
    <h1>Nos Jeux</h1>

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

    <!-- Message si aucun produit -->
    <div v-if="filteredProducts.length === 0">
      Aucun jeu trouvé...
    </div>

    <!-- Grille de jeux -->
    <div v-else class="product-grid">
      <div v-for="jeu in filteredProducts" :key="jeu.id_jeu" class="product-item">
        <img :src="`/images/${jeu.image || 'placeholder.webp'}`" alt="Image jeu" />
        <h2>{{ jeu.nom_jeu }}</h2>
        <p>{{ jeu.description_jeu }}</p>
        <p>Éditeur : {{ jeu.editeur }}</p>
        <p>Âge minimum : {{ jeu.minage }} ans</p>
        <p>Année de publication : {{ jeu.yearpublished }}</p>
        <button disabled>Connectez-vous pour ajouter</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductList',
  data() {
    return {
      produits: [],
      produitsFiltres: [],
      categories: [],
      selectedCategorie: '',
      searchQuery: ''
    };
  },
  computed: {
    filteredProducts() {
      return this.produitsFiltres.filter(p =>
        p.nom_jeu.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async chargerProduits() {
      try {
        const response = await axios.get('http://localhost:3000/api/jeux');
        this.produits = response.data;
        this.produitsFiltres = response.data;
        this.selectedCategorie = '';
      } catch (error) {
        console.error("Erreur de chargement des jeux :", error);
      }
    },
    async appliquerFiltre(type) {
      let url = 'http://localhost:3000/api/jeux';

      if (type === 'recents') {
        url += '/recents';
      } else if (type === 'bien-notes') {
        url += '/bien-notes';
      }

      try {
        const response = await axios.get(url);
        this.produitsFiltres = response.data;
        this.selectedCategorie = '';
      } catch (error) {
        console.error("Erreur lors de l'application du filtre :", error);
      }
    },
    async chargerCategories() {
      try {
        const res = await axios.get('http://localhost:3000/api/jeux/categories');
        this.categories = res.data.map(c => c.nom_cat);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
      }
    },
    async appliquerCategorie() {
      if (!this.selectedCategorie) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/jeux/categorie/${encodeURIComponent(this.selectedCategorie)}`);
        this.produitsFiltres = res.data;
      } catch (error) {
        console.error("Erreur lors du filtre par catégorie :", error);
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
  background-color: #ddd;
  color: #666;
  cursor: not-allowed;
}
</style>
