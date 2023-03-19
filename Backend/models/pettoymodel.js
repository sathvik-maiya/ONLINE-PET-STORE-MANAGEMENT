const mongoose = require("mongoose");
const petToySchema = new mongoose.Schema({
  Toyname: {
    type: String,
    required: [true, "please enter pettoy name"],
  },
  brand: {
    type: String,
    required: [true, "please enter pettoy brand"],
  },
  petClass: {
    type: String,
    required: [true, "please enter pettoy class"],
  },
  description: {
    type: String,
    required: [true, "please enter petmedicine description"],
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
  price: {
    type: Number,
    required: [true, "please enter price"],
    maxLength: [8, "price cannot exceed 8 figures"],
  },
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
  
  
  module.exports = mongoose.model('PetToy', petToySchema);