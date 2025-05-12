const bcrypt = require('bcryptjs');
const db = require('./models'); // Importing the models

const seedDatabase = async () => {
  try {
    // Synchronizing and resetting the database
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // User data with hashed passwords
    const users = [
      {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
      },
      {
        username: 'admin2',
        password: bcrypt.hashSync('admin1234', 10),
        role: 'admin',
      },
      {
        username: 'user1',
        password: bcrypt.hashSync('password1', 10),
        role: 'user',
      },
    ];

    await db.users.bulkCreate(users);
    console.log('Users inserted successfully.');

    // Board games data (17 jeux)
    const products = [
      {
        name: "Small World",
        description: "Un jeu de conquête fantastique dans un monde trop petit pour tout le monde.",
        price: 45.0,
        image: "smallworld.png",
        rating: 4.6,
        stock: 20,
      },
      {
        name: "It's a Wonderful World",
        description: "Un jeu de draft et de gestion pour bâtir un empire prospère.",
        price: 38.0,
        image: "it-s-a-wonderful-world.png",
        rating: 4.7,
        stock: 15,
      },
      {
        name: "Les Aventuriers du Rail: Europe",
        description: "Construisez des routes ferroviaires à travers l'Europe.",
        price: 50.0,
        image: "les-aventuriers-du-rail-europe.png",
        rating: 4.8,
        stock: 18,
      },
      {
        name: "Monopoly",
        description: "Le classique jeu d'achat et d'immobilier.",
        price: 30.0,
        image: "monopoly-edition-2025.png",
        rating: 4.2,
        stock: 25,
      },
      {
        name: "Mysterium",
        description: "Résolvez un mystère en coopération avec un fantôme muet.",
        price: 42.0,
        image: "mysterium.png",
        rating: 4.5,
        stock: 14,
      },
      {
        name: "Risk",
        description: "Un jeu de stratégie militaire pour conquérir le monde.",
        price: 35.0,
        image: "risk.png",
        rating: 4.3,
        stock: 20,
      },
      {
        name: "Saboteur",
        description: "Un jeu de bluff et de stratégie dans une mine d’or.",
        price: 15.0,
        image: "saboteur.png",
        rating: 4.4,
        stock: 30,
      },
      {
        name: "UNO",
        description: "Le célèbre jeu de cartes rapide et familial.",
        price: 10.0,
        image: "uno.png",
        rating: 4.7,
        stock: 40,
      },
      {
        name: "Jeu des 7 Familles",
        description: "Un jeu de cartes éducatif et familial.",
        price: 9.0,
        image: "Jeu-des-7-familles-Ravensburger.png",
        rating: 4.5,
        stock: 35,
      },
      {
        name: "Les Loups-Garous de Thiercelieux",
        description: "Un jeu de rôle à identités secrètes pour animer vos soirées.",
        price: 12.0,
        image: "Loup garou.png",
        rating: 4.6,
        stock: 50,
      },
      {
        name: "Cuisto Dingo",
        description: "Un jeu d’action amusant où un cochon mange trop !",
        price: 28.0,
        image: "gu082964_6.png",
        rating: 4.3,
        stock: 22,
      },
      {
        name: "Hanabi",
        description: "Un jeu coopératif de mémoire et de communication pour créer un feu d'artifice.",
        price: 20.0,
        image: "hanabi.png",
        rating: 4.5,
        stock: 19,
      },
      {
        name: "7 Wonders",
        description: "Un jeu de civilisation stratégique en 30 minutes.",
        price: 48.0,
        image: "7-wonders-Asmodee.png",
        rating: 4.9,
        stock: 17,
      },
      {
        name: "Croque-Carotte",
        description: "Un jeu de course pour enfants avec des pièges surprises.",
        price: 26.0,
        image: "13_231862_1_10_FR.png",
        rating: 4.6,
        stock: 23,
      },
      {
        name: "Mille Bornes",
        description: "Un jeu de cartes sur le thème de la course automobile.",
        price: 22.0,
        image: "511sFh4863L.png",
        rating: 4.4,
        stock: 28,
      },
      {
        name: "SOS Ouistiti",
        description: "Évite de faire tomber les singes dans ce jeu d'adresse amusant.",
        price: 18.0,
        image: "a_02_9605-sos-ouistiti-mattel.png",
        rating: 4.3,
        stock: 26,
      },
      {
        name: "Codenames",
        description: "Un jeu d'association de mots où les espions doivent se retrouver.",
        price: 25.0,
        image: "codenames.png",
        rating: 4.8,
        stock: 30,
      }
    ];

    await db.products.bulkCreate(products);
    console.log('Board games inserted successfully.');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error while seeding the database:', error);
    process.exit(1);
  }
};

seedDatabase();
