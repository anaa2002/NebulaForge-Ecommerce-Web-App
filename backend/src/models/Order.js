import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "Completed",
    },
    stripePaymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
