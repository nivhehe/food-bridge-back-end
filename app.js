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

// MongoDB connection
mongoose.set('strictQuery', false); // optional, to handle Mongoose deprecation warning

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodbridge';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch(err => {
    console.log('MongoDB connection error', err);
  });
