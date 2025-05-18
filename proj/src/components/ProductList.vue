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
      <button
        @click="appliquerFiltre('recents')"
        :class="{ actif: filtreActifKey === 'recents' }"
      >
        Jeux récents
      </button>
      <button
        @click="appliquerFiltre('bien-notes')"
        :class="{ actif: filtreActifKey === 'bien-notes' }"
      >
        Bien notés
      </button>
      <button
        @click="chargerProduits"
        :class="{ actif: filtreActifKey === '' }"
      >
        Réinitialiser
      </button>
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
    <div v-if="filteredProducts.length === 0" class="no-results">
      Aucun jeu trouvé...
    </div>

    <!-- Grille produits -->
    <div v-else class="product-grid">
      <div v-for="jeu in filteredProducts" :key="jeu.id_jeu" class="product-item">
        <img :src="`/images/${jeu.image_jeu || 'placeholder.png'}`" alt="Image jeu" />
        <h2>{{ jeu.nom_jeu }}</h2>
        <p>{{ jeu.description_jeu }}</p>
        <p><strong>Éditeur :</strong> {{ jeu.editeur }}</p>
        <p><strong>Âge minimum :</strong> {{ jeu.minage }} ans</p>
        <p><strong>Année :</strong> {{ jeu.yearpublished }}</p>

        <button 
          v-if="isAuthenticated" 
          @click="handleAddToCart(jeu)"
        >
          Ajouter aux offres
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
      addToCartMessage: '',
      filtreActifKey: ''
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
    ...mapActions(['addPendingOffer']),
    async handleAddToCart(produit) {
      this.addPendingOffer(produit);
      this.addToCartMessage = `${produit.nom_jeu} ajouté pour une future offre !`;
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
        this.filtreActifKey = '';
      } catch (err) {
        console.error('Erreur chargement jeux :', err);
      }
    },
    async appliquerFiltre(type) {
      let url = 'http://localhost:3000/api/jeux';
      if (type === 'recents') url += '/recents';
      else if (type === 'bien-notes') url += '/bien-notes';
      this.filtreActifKey = type;

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
        this.filtreActifKey = ''; // réinitialiser les boutons
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
  padding: 30px;
  max-width: 1200px;
  margin: auto;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.success-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.search-bar {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters button {
  padding: 10px 18px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filters button:hover {
  background-color: #d0d0d0;
}

.filters button.actif {
  background-color: #0056b3;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.categorie-filter {
  margin-bottom: 25px;
  font-size: 16px;
}

.categorie-filter select {
  padding: 8px 10px;
  font-size: 15px;
  margin-left: 10px;
  border-radius: 5px;
}

.no-results {
  text-align: center;
  color: #888;
  font-size: 18px;
  margin-top: 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.product-item {
  border: 1px solid #ddd;
  padding: 18px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.product-item:hover {
  transform: translateY(-4px);
}

.product-item img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  margin-bottom: 12px;
}

.product-item h2 {
  font-size: 18px;
  color: #333;
  margin: 8px 0;
}

.product-item p {
  font-size: 14px;
  color: #555;
  margin: 5px 0;
}

.product-item button {
  margin-top: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.product-item button:hover {
  background-color: #0056b3;
}

.product-item button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
