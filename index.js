const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
const users = [];

// Registration endpoint
app.post('/user/register', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).json({ message: 'missing data' });
  }
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });

  res.json({ user : users[users.length-1] , ack : true });
});

app.post('/user/login', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).json({ message: 'missing data' });
  }
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: user.username }, 'secret');

  res.json({ message: 'Login successful', token });
});



app.get('/user/getUserData', async (req, res) => {
  const { authorization } = req.headers;
  console.log(authorization)

  // Check if authorization header is present
  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authorization.split(' ')[1];
  const decoded = jwt.verify(authorization, 'secret');
  const { username } = decoded;

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }

  res.json({ message: 'User data retrieved', username: user.username });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));