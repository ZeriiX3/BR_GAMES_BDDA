require('dotenv').config(); // Charge .env
const bcrypt = require('bcryptjs');
const db = require('./models'); 

const seedDatabase = async () => {
  try {
    console.log('Synchronizing database...');
    await db.sequelize.sync({ force: true }); // Reset tables
    console.log('Database synchronized.');

    // User data with hashed passwords
    const users = [
      {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10), // Hashing the password
        role: 'admin',
      },
      {
        username: 'admin2',
        password: bcrypt.hashSync('admin1234', 10), // Hashing the password
        role: 'admin',
      },
      {
        username: 'user1',
        password: bcrypt.hashSync('password1', 10), // Hashing the password
        role: 'user',
      },
    ];

    // Inserting users
    await db.users.bulkCreate(users);
    console.log('Users inserted successfully.');
    

    // Product data
    const products = [
      {
        name: "Dior J'adore",
        description: 'Eau de parfum for women - Floral and fruity notes',
        price: 108.0,
        image: 'jadore.jpg',
        rating: 4.5,
        stock: 20,
      },
      {
        name: 'Chanel N°5',
        description: 'Timeless and elegant eau de parfum',
        price: 122.0,
        image: 'chanel5.jpg',
        rating: 5,
        stock: 15,
      },
      {
        name: 'Armani Si',
        description: 'Captivating and sophisticated perfume',
        price: 107.0,
        image: 'armani_si.jpg',
        rating: 4.7,
        stock: 25,
      },
      // Women's perfumes
      {
        name: "Yves Saint Laurent Mon Paris",
        description: 'Fruity and floral fragrance with a touch of patchouli',
        price: 130.0,
        image: 'mon_paris.jpg',
        rating: 4.6,
        stock: 18,
      },
      {
        name: 'Lancôme La Vie Est Belle',
        description: 'Sweet and floral with iris, patchouli, and gourmand notes',
        price: 125.0,
        image: 'la_vie_est_belle.jpg',
        rating: 4.8,
        stock: 22,
      },
      {
        name: 'Gucci Bloom',
        description: 'A bouquet of jasmine, tuberose, and rangoon creeper',
        price: 115.0,
        image: 'gucci_bloom.jpg',
        rating: 4.3,
        stock: 17,
      },
      {
        name: 'Chanel Coco Mademoiselle',
        description: 'A fresh, modern interpretation of an oriental fragrance, with a blend of floral and fruity notes.',
        price: 135.0,
        image: 'coco_mademoiselle.jpg',
        rating: 4.8,
        stock: 20,
      },
      {
        name: 'Jean Paul Gaultier Scandal',
        description: 'A sweet and honeyed fragrance with a touch of floral, perfect for the bold and daring.',
        price: 115.0,
        image: 'scandal.jpg',
        rating: 4.6,
        stock: 22,
      },
      {
        name: 'Prada La Femme',
        description: 'An elegant and luxurious fragrance with notes of frangipani, tuberose, and beeswax.',
        price: 125.0,
        image: 'prada_la_femme.jpg',
        rating: 4.7,
        stock: 18,
      },
      {
        name: 'Yves Saint Laurent Black Opium',
        description: 'A deep and sensual fragrance with notes of coffee, vanilla, and white flowers.',
        price: 130.0,
        image: 'black_opium.jpg',
        rating: 4.9,
        stock: 15,
      },
      {
        name: 'Burberry Her',
        description: 'A fruity fragrance with notes of red berries, jasmine, and vanilla, creating a modern and vibrant scent.',
        price: 105.0,
        image: 'burberry_her.jpg',
        rating: 4.4,
        stock: 20,
      },
      // Men's perfumes
      {
        name: "Chanel Bleu de Chanel",
        description: 'A woody aromatic fragrance with notes of citrus and woods',
        price: 150.0,
        image: 'bleu_de_chanel.jpg',
        rating: 4.9,
        stock: 30,
      },
      {
        name: 'Dior Sauvage',
        description: 'Fresh and spicy fragrance with notes of Calabrian bergamot and Sichuan pepper',
        price: 140.0,
        image: 'sauvage.jpg',
        rating: 4.7,
        stock: 25,
      },
      {
        name: 'Tom Ford Noir Extreme',
        description: 'Warm and spicy fragrance with notes of amber and vanilla',
        price: 170.0,
        image: 'noir_extreme.jpg',
        rating: 4.6,
        stock: 20,
      },
      {
        name: 'Armani Code',
        description: 'A blend of citrus and leather notes with a warm, spicy finish',
        price: 125.0,
        image: 'armani_code.jpg',
        rating: 4.5,
        stock: 30,
      },
      {
        name: 'Paco Rabanne Invictus',
        description: 'Woody and fresh with a hint of marine and grapefruit notes',
        price: 110.0,
        image: 'invictus.jpg',
        rating: 4.4,
        stock: 28,
      },
      {
        name: 'Hugo Boss Bottled',
        description: 'A blend of apple, cinnamon, and vanilla with woody notes',
        price: 95.0,
        image: 'boss_bottled.jpg',
        rating: 4.2,
        stock: 35,
      },
      {
        name: 'Bvlgari Man in Black',
        description: 'A bold and sensual fragrance with leather, spices, and rum notes.',
        price: 150.0,
        image: 'man_in_black.jpg',
        rating: 4.6,
        stock: 18,
      },
      {
        name: 'Versace Eros',
        description: 'A vibrant, fresh fragrance with mint, green apple, and lemon, combining fresh notes with woody undertones.',
        price: 120.0,
        image: 'eros.jpg',
        rating: 4.7,
        stock: 25,
      },
      {
        name: 'Dolce & Gabbana The One',
        description: 'A classic and elegant fragrance with notes of tobacco, amber, and cedarwood.',
        price: 130.0,
        image: 'the_one.jpg',
        rating: 4.8,
        stock: 22,
      },
      {
        name: 'Creed Aventus',
        description: 'A sophisticated fragrance with notes of pineapple, birch, and musk, evoking confidence and strength.',
        price: 300.0,
        image: 'aventus.jpg',
        rating: 4.9,
        stock: 15,
      },
      {
        name: 'Issey Miyake L\'Eau d\'Issey Pour Homme',
        description: 'A fresh and aquatic fragrance with hints of yuzu, tarragon, and sandalwood.',
        price: 95.0,
        image: 'leau_dissey.jpg',
        rating: 4.5,
        stock: 30,
      },
      {
        name: 'Bvlgari Aqva Pour Homme',
        description: 'A refreshing and aquatic fragrance with notes of citrus, posidonia, and amber.',
        price: 120.0,
        image: 'aqva_pour_homme.jpg',
        rating: 4.6,
        stock: 20,
      },
      {
        name: 'Giorgio Armani Acqua di Giò',
        description: 'A fresh and aromatic fragrance with notes of jasmine, rosemary, and patchouli.',
        price: 140.0,
        image: 'acqua_di_gio.jpg',
        rating: 4.7,
        stock: 22,
      },
    ];
    
    
    
    // Inserting products
    await db.products.bulkCreate(products);
    console.log('Products inserted successfully.');

    // Success message for database seeding
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    // Error handling
    console.error('Error while seeding the database:', error);
    process.exit(1);
  }
};

seedDatabase();
