exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.users.findAll(); // Replace `db.users` with your Sequelize model
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await db.users.findByPk(req.params.id); // Replace `db.users` with your Sequelize model
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
