const mongoose = require("mongoose");
const petSchema = new mongoose.Schema({
  petClass: {
    type: String,
    required: [true, "please enter pet class"],
  },
  breed: {
    type: String,
    required: [true, "please enter breed name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please enter pet description"],
  },
  price: {
    type: Number,
    required: [true, "please enter pet price"],
    maxLength: [8, "price cannot exceed 8 figures"],
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
module.exports = mongoose.model("pet", petSchema);
