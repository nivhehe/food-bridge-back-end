const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/food', require('./routes/food'));

// MongoDB & Server
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 5001, () =>
      console.log(`API running on port ${process.env.PORT || 5001}`)))
  .catch(err => console.log('MongoDB connection error', err));
