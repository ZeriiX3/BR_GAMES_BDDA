// Auth controller

const db = require('../models'); // Import database models
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens

// User Registration
exports.register = async (req, res) => { 
  try {
    const { username, password, role } = req.body;
    
    // Check if the username already exists
    const existingUser = await db.users.findOne({ where: { username } });
    
    if (existingUser) {
      // If username already exists, return an error message
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Proceed with password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.users.create({
      username,
      password: hashedPassword,
      role,
    });

    // Respond with success message
    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error while creating the user',
      error: error.message,
    });
  }
};



// User Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.users.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    
    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Payload includes user role
      
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error during login',
      error: error.message,
    });
  }
};
