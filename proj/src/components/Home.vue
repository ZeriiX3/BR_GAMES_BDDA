<template>
  <div class="hero-section">
    <div class="hero-text">
      <h1>Bienvenue chez BRGAMES</h1>
      <p>Découvrez notre collection exclusive de jeux et profitez des meilleures offres.</p>
      <router-link to="/products">
        <button class="explore-btn">Explorer les produits</button>
      </router-link>
      <p class="eco-info">
        Nous sommes engagés pour la durabilité : images optimisées, chargement différé, hébergement éco-responsable et animations minimales.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home', 
};
</script>

<style scoped>
/* Mise en forme de la section d'accueil */
.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../assets/background.png') no-repeat center center/cover;
  color: #fff;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.hero-text h1 {
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.hero-text p {
  font-size: 22px;
  margin-bottom: 50px;
  line-height: 1.6;
  font-weight: 300;
}

.explore-btn {
  background-color: #ff8c00;
  color: white;
  padding: 20px 50px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.explore-btn:hover {
  background-color: #ff7a00;
  transform: translateY(-5px);
}

.explore-btn:focus {
  outline: none;
}

@media (max-width: 768px) {
  .hero-text h1 {
    font-size: 40px;
  }

  .hero-text p {
    font-size: 18px;
  }

  .explore-btn {
    padding: 15px 40px;
    font-size: 18px;
  }
}

.eco-info {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #fff;
  opacity: 0.8;
  text-align: center;
}
</style>
