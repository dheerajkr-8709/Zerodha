const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

module.exports = { OrdersSchema };
