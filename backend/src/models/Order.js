import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

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
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item.",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmountCents: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "usd",
      lowercase: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
