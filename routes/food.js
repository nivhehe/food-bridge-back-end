const express = require('express');
const FoodItem = require('../models/FoodItem');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Post new food (restaurant only)
router.post('/', authenticate, async (req, res) => {
  const { name, category, quantity, unit, description, expiryTime } = req.body;
  if (!name || !category || !quantity || !unit || !expiryTime) 
    return res.status(400).json({ message: 'Required fields missing' });
  const food = await FoodItem.create({
    name, category, quantity, unit, description, expiryTime,
    postedBy: req.user.userId
  });
  res.status(201).json(food);
});

// Get all non-expired food
router.get('/', async (req, res) => {
  const now = new Date();
  // The key is .populate('postedBy')
  const foods = await FoodItem.find().populate('postedBy');
  const nonExpired = foods.filter(food => {
    const expiresAt = new Date(food.createdAt.getTime() + food.expiryTime * 60 * 60 * 1000);
    return expiresAt > now && food.status === 'Active';
  });
  res.json(nonExpired);
});


// My Posts (restaurant)
router.get('/restaurant/:userId', authenticate, async (req, res) => {
  const now = new Date();
  const foods = await FoodItem.find({ postedBy: req.params.userId });
  const nonExpired = foods.filter(food => {
    const expiresAt = new Date(food.createdAt.getTime() + food.expiryTime * 60 * 60 * 1000);
    return expiresAt > now && food.status === 'Active';
  });
  res.json(nonExpired);
});

// Auto-remove expired
router.delete('/auto-remove', authenticate, async (req, res) => {
  const now = new Date();
  const foods = await FoodItem.find({ status: 'Active' });
  for (let food of foods) {
    const expiresAt = new Date(food.createdAt.getTime() + food.expiryTime * 60 * 60 * 1000);
    if (expiresAt < now) {
      await FoodItem.findByIdAndUpdate(food._id, { status: 'Claimed' });
    }
  }
  res.json({ message: "Expired foods updated" });
});

module.exports = router;
