<template>
  <div class="offres-container">
    <h1>Offres disponibles</h1>

    <!-- Messages -->
    <div v-if="successMessage" class="message success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="message error">{{ errorMessage }}</div>

    <!-- Ajouter une offre -->
    <div v-if="pending.length > 0" class="pending-section">
      <h2>Ajouter une offre</h2>
      <div v-for="jeu in pending" :key="jeu.id_jeu" class="pending-card">
        <img :src="`/images/${jeu.image_jeu || 'placeholder.png'}`" alt="image jeu" />
        <div class="pending-details">
          <h3>{{ jeu.nom_jeu }}</h3>
          <p>{{ jeu.description_jeu }}</p>
          <input
            v-model.number="prixOffres[jeu.id_jeu]"
            type="number"
            min="0"
            step="0.01"
            placeholder="Prix en €"
          />
        </div>
        <div class="pending-actions">
          <button @click="envoyerOffre(jeu)" class="btn">Valider l'offre</button>
          <button @click="removeFromPending(jeu.id_jeu)" class="btn secondary">Supprimer</button>
        </div>
      </div>
    </div>

    <hr class="separator" />

    <!-- Liste des offres -->
    <div v-if="offres.length === 0" class="no-offre">
      Aucune offre disponible pour le moment.
    </div>

    <div v-else class="offre-grid">
      <div v-for="offre in offres" :key="offre.id_offre" class="offre-card">
        <img :src="`/images/${offre.image_jeu || 'placeholder.png'}`" alt="image du jeu" />
        <h3>{{ offre.nom_jeu }}</h3>
        <p>Vendu par : <strong>{{ offre.pseudo }}</strong></p>
        <p>Prix : <strong>{{ Number(offre.prix).toFixed(2) }} €</strong></p>
        <p>Date : {{ formatDate(offre.date_offre) }}</p>
        <button
          v-if="getUserIdFromToken() === offre.id_utilisateur"
          @click="supprimerOffre(offre.id_offre)"
          class="btn delete-btn"
        >
          Supprimer
        </button>
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
      prixOffres: {},
      successMessage: '',
      errorMessage: ''
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
        this.showError("Erreur lors du chargement des offres.");
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    },
    async envoyerOffre(jeu) {
      const prix = this.prixOffres[jeu.id_jeu];
      if (!prix || prix <= 0) {
        this.showError("Veuillez entrer un prix valide.");
        return;
      }

      const token = localStorage.getItem('token');
      const utilisateurId = this.getUserIdFromToken(token);
      const id_offre = 'O' + Date.now();

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
        this.showSuccess("Offre ajoutée avec succès !");
      } catch (err) {
        this.showError("Erreur lors de l'ajout de l'offre.");
      }
    },
    getUserIdFromToken(token = localStorage.getItem('token')) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id_utilisateur || payload.id || '';
      } catch (e) {
        return '';
      }
    },
    async supprimerOffre(id_offre) {
      const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette offre ?");
      if (!confirmation) return;

      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/offres/${id_offre}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.offres = this.offres.filter(o => o.id_offre !== id_offre);
        this.showSuccess("Offre supprimée avec succès.");
      } catch (err) {
        this.showError("Impossible de supprimer l'offre.");
      }
    },
    showSuccess(message) {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ''), 3000);
    },
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = ''), 4000);
    }
  },
  mounted() {
    this.chargerOffres();
  }
};
</script>

<style scoped>
.offres-container {
  padding: 30px;
  max-width: 1200px;
  margin: auto;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9f9f9;
}

h1, h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.message {
  max-width: 600px;
  margin: 0 auto 20px;
  padding: 12px 20px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.no-offre {
  text-align: center;
  color: #777;
  font-size: 18px;
  margin-top: 30px;
}

.separator {
  margin: 40px 0;
  border: none;
  height: 1px;
  background-color: #ddd;
}

.offre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 25px;
}

.offre-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s;
}

.offre-card:hover {
  transform: translateY(-4px);
}

.offre-card img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  margin-bottom: 12px;
}

.offre-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.offre-card p {
  font-size: 14px;
  color: #555;
  margin: 4px 0;
}

.pending-section {
  margin-top: 30px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.pending-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.pending-card img {
  width: 100px;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.pending-details {
  flex-grow: 1;
}

.pending-card h3 {
  font-size: 16px;
  margin: 0 0 5px;
  color: #333;
}

.pending-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.pending-card input {
  margin-top: 8px;
  padding: 6px 10px;
  font-size: 14px;
  width: 140px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.pending-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}

.btn.secondary {
  background-color: #6c757d;
}

.btn.secondary:hover {
  background-color: #495057;
}

.delete-btn {
  margin-top: 12px;
}
</style>
