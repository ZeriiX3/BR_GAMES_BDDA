<template>
  <div class="offres-container">
    <h1>Offres disponibles</h1>

    <div v-if="offres.length === 0">
      Aucune offre disponible pour le moment.
    </div>

    <div v-else class="offre-grid">
      <div v-for="offre in offres" :key="offre.id_offre" class="offre-card">
        <img :src="`/images/${offre.image_jeu || 'placeholder.png'}`" alt="image du jeu" />
        <h3>{{ offre.nom_jeu }}</h3>
        <p>Vendu par : {{ offre.pseudo }}</p>
        <p>Prix : {{ Number(offre.prix).toFixed(2) }} €</p>
        <p>Date : {{ formatDate(offre.date_offre) }}</p>
      </div>
    </div>

    <hr />

    <div v-if="pending.length > 0" class="pending-section">
      <h2>Ajouter une offre</h2>
      <div v-for="jeu in pending" :key="jeu.id_jeu" class="pending-card">
        <img :src="`/images/${jeu.image_jeu || 'placeholder.png'}`" alt="image jeu" />
        <h3>{{ jeu.nom_jeu }}</h3>
        <p>{{ jeu.description_jeu }}</p>
        <input
          v-model.number="prixOffres[jeu.id_jeu]"
          type="number"
          min="0"
          step="0.01"
          placeholder="Prix en €"
        />
        <button @click="envoyerOffre(jeu)">Valider l'offre</button>
        <button @click="removeFromPending(jeu.id_jeu)">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import { API_URL } from '@/api';

export default {
  data() {
    return {
      offres: [],
      prixOffres: {}
    };
  },
  computed: {
    ...mapGetters(['getPendingOffers', 'isAuthenticated']),
    pending() {
      return this.getPendingOffers;
    }
  },
  methods: {
    ...mapActions({
      removeFromPending: 'removePendingOffer'
    }),
    async chargerOffres() {
      try {
        const res = await axios.get(`${API_URL}/offres`);
        this.offres = res.data;
      } catch (err) {
        console.error('Erreur chargement offres :', err);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    },
    async envoyerOffre(jeu) {
      const prix = this.prixOffres[jeu.id_jeu];
      if (!prix || prix <= 0) {
        alert("Veuillez entrer un prix valide.");
        return;
      }

      const token = localStorage.getItem('token');
      const utilisateurId = this.getUserIdFromToken(token); // simple extraction ou à adapter

      const id_offre = 'O' + Date.now(); // simple ID unique

      try {
        await axios.post(`${API_URL}/offres/ajouter`, {
          id_offre,
          prix,
          id_utilisateur: utilisateurId,
          id_jeu: jeu.id_jeu
        });

        this.removeFromPending(jeu.id_jeu);
        delete this.prixOffres[jeu.id_jeu];
        await this.chargerOffres();
      } catch (err) {
        console.error("Erreur ajout offre :", err);
        alert("Erreur lors de l'ajout de l'offre.");
      }
    },
    getUserIdFromToken(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id_utilisateur || payload.id || '';
      } catch (e) {
        console.error("Erreur décodage token", e);
        return '';
      }
    }
  },
  mounted() {
    this.chargerOffres();
  }
};
</script>

<style scoped>
.offres-container {
  padding: 20px;
}

.offre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.offre-card, .pending-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  background: #fff;
  text-align: center;
}

.offre-card img, .pending-card img {
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
}

.pending-section {
  margin-top: 30px;
}

.pending-card input {
  margin: 10px 0;
  padding: 5px;
  width: 100%;
}

.pending-card button {
  margin: 5px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

.pending-card button:hover {
  background-color: #0056b3;
}
</style>
