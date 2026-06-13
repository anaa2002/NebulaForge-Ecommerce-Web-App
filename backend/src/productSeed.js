import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Product from "../src/models/Product.js";

const sampleInventory = [
  {
    name: "StellarCore i9 Quantum Processor",
    category: "Processors",
    price: 899.99,
    description:
      "A 16-core quantum CPU capable of calculating hyper-jump trajectories in nanoseconds.",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1548&auto=format&fit=crop",
    stock: 12,
    manufacturer: "NovaTech",
  },
  {
    name: "Nebula Frost V2 Cooler",
    category: "Cooling",
    price: 149.99,
    description:
      "Liquid nitrogen cooling loops to keep your quantum drives below freezing.",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80",
    stock: 3,
    manufacturer: "AstroDynamics",
  },
  {
    name: "Singularity 32GB Hyper-RAM",
    category: "RAM",
    price: 249.99,
    description:
      "Volatile memory matrix with built-in error correction for deep space flights.",
    image:
      "https://images.unsplash.com/photo-1600336757481-6185c4be6ff6?q=80&w=1546&auto=format&fit=crop",
    stock: 0,
    manufacturer: "NovaTech",
  },
  {
    name: "RTX Supernova Graphics Array",
    category: "Graphics Cards",
    price: 1299.99,
    description:
      "Renders entire galaxies in real-time. Do not look directly at the exhaust port.",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80",
    stock: 5,
    manufacturer: "StellarForge",
  },
  {
    name: "Quantum Void SSD 2TB",
    category: "Storage",
    price: 199.99,
    description:
      "Stores data in a pocket dimension. Virtually infinite read/write speeds.",
    image:
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&q=80",
    stock: 25,
    manufacturer: "EventHorizon",
  },
  {
    name: "Obsidian Monolith ATX Case",
    category: "Cases",
    price: 179.99,
    description:
      "A sleek, dark matter chassis that absorbs all internal RGB lighting.",
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&q=80",
    stock: 8,
    manufacturer: "StellarForge",
  },
  {
    name: "AstroCore Ryzen 9",
    category: "Processors",
    price: 749.99,
    description:
      "Multi-threaded behemoth perfect for running heavy planetary simulations.",
    image:
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=80",
    stock: 15,
    manufacturer: "CosmicAMD",
  },
  {
    name: "Pulsar 64GB DDR5 Matrix",
    category: "RAM",
    price: 399.99,
    description:
      "Ultra-high frequency memory sticks that glow with the radiation of a dying star.",
    image:
      "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=500&q=80",
    stock: 10,
    manufacturer: "NovaTech",
  },

  {
    name: "RX EventHorizon 7900",
    category: "Graphics Cards",
    price: 1099.99,
    description:
      "Bends light around your monitor for true immersive 8K interstellar gaming.",
    image:
      "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=500&q=80",
    stock: 2,
    manufacturer: "CosmicAMD",
  },
  {
    name: "Black Hole Archival HDD 20TB",
    category: "Storage",
    price: 349.99,
    description:
      "Spinning magnetic platters so dense they exert their own gravitational pull.",
    image:
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&q=80",
    stock: 40,
    manufacturer: "EventHorizon",
  },
  {
    name: "Supernova Glass Tower",
    category: "Cases",
    price: 229.99,
    description:
      "100% transparent tempered stellar-glass. Shows off your entire rig.",
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&q=80",
    stock: 4,
    manufacturer: "StellarForge",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database.");
    await Product.deleteMany();
    console.log("Inventory cleared.");
    await Product.insertMany(sampleInventory);
    console.log("Cosmic inventory successfully seeded!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
