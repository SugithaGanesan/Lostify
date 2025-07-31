const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Create new item
router.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// ✅ Get item count for stats
router.get('/count', async (req, res) => {
  try {
    const total = await Item.countDocuments();
    const returned = await Item.countDocuments({ status: 'returned' });
    res.json({ total, returned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update item status (for marking as returned)
router.put('/:id/status', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
