## Installation du projet

Avant de commencer, assurez-vous que **Node.js** est installé sur votre machine.  
(Sinon, téléchargez-le depuis [https://nodejs.org/](https://nodejs.org/)).

---

### Installation des dépendances

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/ZeriiX3/BR_GAMES_BDDA
   ```


2. **Installer les dépendances du frontend (Vue.js)**
   ```bash
   cd proj
   npm install
   ```

3. **Installer les dépendances du backend (Node.js/Express)**
   ```bash
   cd proj/backend
   npm install
   npm install pg
   ```



---

## Lancer le Backend (API Express)

Depuis le dossier `proj/backend/` :

   ```bash
   cd proj/backend
   node server.js
   ```
Si vous voulez reset la BDD, vous pouvez faire un node seed.js depuis ce dossier.

---

## Lancer le Frontend (Vue.js)

Depuis le dossier `proj/` :

   ```bash
   cd proj
   npm run serve
   ```
