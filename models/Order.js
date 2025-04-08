const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If you want guest checkout, do not make it required
    items: [
      {
       
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,

   
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    paymentInfo: {
      paymentId: String,
      paymentStatus: String,
      paidAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
