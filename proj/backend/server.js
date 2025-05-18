require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Import routes
const authRoutes = require('./routes/auth.routes');
const utilisateursRoutes = require('./routes/utilisateurs.routes');
const jeuxRoutes = require('./routes/jeux.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', utilisateursRoutes);
app.use('/api/jeux', jeuxRoutes);

// Connect to Supabase without sync
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection successful');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

module.exports = app;
