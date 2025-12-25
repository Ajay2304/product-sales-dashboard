const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock user as per assignment (no registration needed)
const mockUser = {
  username: 'admin',
  password: bcrypt.hashSync('password', 10)  // hashed "password"
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // Check credentials
  if (username !== mockUser.username || !bcrypt.compareSync(password, mockUser.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });

  res.json({ message: 'Login successful', token });
};