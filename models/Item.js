const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  status: {
    type: String,
    enum: ['lost', 'found', 'returned'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imageUrl: String
});

module.exports = mongoose.model('Item', ItemSchema);
