import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A cosmic hardware item must have a name!"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please specify a weapon/component category."],
      enum: [
        "Processors",
        "Cooling",
        "RAM",
        "Graphics Cards",
        "Storage",
        "Cases",
      ],
    },
    price: {
      type: Number,
      required: [true, "Items cannot be traded for free! Price is required."],
      min: [0, "Price cannot be negative in this dimension."],
    },
    description: {
      type: String,
      required: [true, "Please describe the tech specifications."],
    },
    image: {
      type: String,
      default: "/images/placeholder-hardware.jpg",
    },
    stock: {
      type: Number,
      required: [true, "Inventory count is required."],
      min: [0, "Stock cannot drop below zero."],
      default: 0,
    },
    manufacturer: {
      type: String,
      required: [true, "Which mega-corp forged this item?"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
