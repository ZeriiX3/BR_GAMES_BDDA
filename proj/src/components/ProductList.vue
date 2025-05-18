<template>
  <div class="product-list">
    <h1>Nos Jeux</h1>

    <div v-if="addToCartMessage" class="success-message">
      {{ addToCartMessage }}
    </div>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Rechercher un jeu par nom..."
      class="search-bar"
    />

    <div class="filters">
      <button @click="appliquerFiltre('recents')" :class="{ actif: filtreActifKey === 'recents' }">Jeux récents</button>
      <button @click="appliquerFiltre('bien-notes')" :class="{ actif: filtreActifKey === 'bien-notes' }">Bien notés</button>
      <button @click="chargerProduits" :class="{ actif: filtreActifKey === '' }">Réinitialiser</button>
    </div>

    <div class="categorie-filter">
      <label for="categorie-select">Filtrer par catégorie :</label>
      <select id="categorie-select" v-model="selectedCategorie" @change="appliquerCategorie">
        <option disabled value="">-- Choisissez une catégorie --</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div v-if="filteredProducts.length === 0" class="no-results">
      Aucun jeu trouvé...
    </div>

    <div v-else class="product-grid">
      <div v-for="jeu in filteredProducts" :key="jeu.id_jeu" class="product-item">
        <img :src="`/images/${jeu.image_jeu || 'placeholder.png'}`" alt="Image jeu" />
        <h2>{{ jeu.nom_jeu }}</h2>
        <p>{{ jeu.description_jeu }}</p>
        <p><strong>Éditeur :</strong> {{ jeu.editeur }}</p>
        <p><strong>Âge minimum :</strong> {{ jeu.minage }} ans</p>
        <p><strong>Année :</strong> {{ jeu.yearpublished }}</p>

        <button v-if="isAuthenticated" @click="handleAddToCart(jeu)">Ajouter aux offres</button>
        <button v-else disabled>Connectez-vous pour ajouter</button>

        <button @click="afficherDetails(jeu)" class="details-button">Détails</button>
      </div>
    </div>

    <div v-if="jeuSelectionne" class="details-panel">
      <div class="details-content">
        <h2>{{ jeuSelectionne.nom_jeu }}</h2>
        <img :src="`/images/${jeuSelectionne.image_jeu || 'placeholder.png'}`" alt="Image détail" style="max-width: 100%; height: auto; margin-bottom: 10px;" />
        <p><strong>Description :</strong> {{ jeuSelectionne.description_jeu }}</p>
        <p><strong>Éditeur :</strong> {{ jeuSelectionne.editeur }}</p>
        <p><strong>Âge minimum :</strong> {{ jeuSelectionne.minage }} ans</p>
        <p><strong>Année de publication :</strong> {{ jeuSelectionne.yearpublished }}</p>
        <p><strong>Catégories :</strong> {{ jeuSelectionne.categories?.join(', ') || 'Non spécifiées' }}</p>
        <p><strong>Note moyenne :</strong> {{ typeof jeuSelectionne.moyenne_note === 'number' ? jeuSelectionne.moyenne_note.toFixed(1) : 'Non noté' }}/10</p>

        <div v-if="jeuSelectionne.avis.length">
          <h3 style="margin-top: 20px;">Avis</h3>
          <div v-for="avis in jeuSelectionne.avis" :key="avis.id_avis" class="avis">
            <p><strong>{{ avis.pseudo }}</strong> — {{ avis.note_jeu }}/10</p>
            <p>{{ avis.contenue_avis }}</p>
            <p style="font-size: 13px; color: #999;">({{ new Date(avis.date_avis).toLocaleDateString() }})</p>
            <hr />
          </div>
        </div>
        <p v-else>Aucun avis disponible.</p>

        <button @click="fermerDetails" class="close-button">Fermer</button>
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
      filtreActifKey: '',
      jeuSelectionne: null
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
        const produitsAvecDetails = await Promise.all(
          res.data.map(async jeu => {
            const [avis, cat] = await Promise.all([
              axios.get(`http://localhost:3000/api/jeux/${jeu.id_jeu}/avis`).then(r => r.data).catch(() => []),
              axios.get(`http://localhost:3000/api/jeux/${jeu.id_jeu}/categories`).then(r => r.data.map(c => c.nom_cat)).catch(() => [])
            ]);
            return {
              ...jeu,
              moyenne_note: avis.length ? avis.reduce((acc, a) => acc + a.note_jeu, 0) / avis.length : null,
              categories: cat,
              avis
            };
          })
        );
        this.produits = produitsAvecDetails;
        this.produitsFiltres = produitsAvecDetails;
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
        const produitsAvecDetails = await Promise.all(
          res.data.map(async jeu => {
            const [avis, cat] = await Promise.all([
              axios.get(`http://localhost:3000/api/jeux/${jeu.id_jeu}/avis`).then(r => r.data).catch(() => []),
              axios.get(`http://localhost:3000/api/jeux/${jeu.id_jeu}/categories`).then(r => r.data.map(c => c.nom_cat)).catch(() => [])
            ]);
            return {
              ...jeu,
              moyenne_note: avis.length ? avis.reduce((acc, a) => acc + a.note_jeu, 0) / avis.length : null,
              categories: cat,
              avis
            };
          })
        );
        this.produitsFiltres = produitsAvecDetails;
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
        const produitsAvecDetails = await Promise.all(
          res.data.map(async jeu => {
            const [avis, cat] = await Promise.all([
              axios.get(`http://localhost:3000/api/jeux/${jeu.id_jeu}/avis`).then(r => r.data).catch(() => []),
              axios.get(`http://localhost:3000/api/jeux/${jeu.id_jeu}/categories`).then(r => r.data.map(c => c.nom_cat)).catch(() => [])
            ]);
            return {
              ...jeu,
              moyenne_note: avis.length ? avis.reduce((acc, a) => acc + a.note_jeu, 0) / avis.length : null,
              categories: cat,
              avis
            };
          })
        );
        this.produitsFiltres = produitsAvecDetails;
        this.filtreActifKey = '';
      } catch (err) {
        console.error('Erreur filtre catégorie :', err);
      }
    },
    afficherDetails(jeu) {
      this.jeuSelectionne = jeu;
    },
    fermerDetails() {
      this.jeuSelectionne = null;
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
  margin-top: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 14px;
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

.details-button {
  background-color: #6c757d;
}

.details-button:hover {
  background-color: #5a6268;
}

.details-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 90%;
  max-width: 500px;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}

.details-content h2 {
  margin-top: 0;
  color: #333;
}

.details-content p {
  font-size: 15px;
  margin: 8px 0;
}

.close-button {
  margin-top: 20px;
  background-color: #dc3545;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #c82333;
}
</style>
