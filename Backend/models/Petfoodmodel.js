const mongoose = require("mongoose");
const petfoodSchema = new mongoose.Schema({
  foodname: {
    type: String,
    required: [true, "please enter food name"],
  },
  brand: {
    type: String,
    required: [true, "please enter petfood brand name"],
  },
  petClass: {
    type: String,
    required: [true, "please enter petfood class"],
  },
  description: {
    type: String,
    required: [true, "please enter petfood description"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  flavor: {
    type: String,
    default: "chicken",
  },
  price: {
    type: Number,
    required: [true, "please enter price"],
    maxlength: [8, "price cannot exceed 8 figures"],
  },
  stock: {
    type: Number,
    required: [true, "please enter  pet stock"],
    maxLength: [4, "stock cannot exceed four characters"],
    default: 1,
  },
  numofreviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

  
  module.exports = mongoose.model('petfood', petfoodSchema);