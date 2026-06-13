import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

function normalizeCartItems(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new ApiError("Cart is empty.", 400, "EMPTY_CART");
  }

  return cartItems.map((item) => {
    const productId = item.productId || item._id;
    const quantity = Number(item.quantity);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(
        "Invalid product ID in cart.",
        400,
        "INVALID_PRODUCT_ID",
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ApiError("Invalid product quantity.", 400, "INVALID_QUANTITY");
    }

    return {
      productId,
      quantity,
    };
  });
}

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const cartItems = normalizeCartItems(req.body.cartItems);

  const productIds = cartItems.map((item) => item.productId);
  const uniqueProductIds = [...new Set(productIds)];

  const products = await Product.find({
    _id: { $in: uniqueProductIds },
  });

  if (products.length !== uniqueProductIds.length) {
    throw new ApiError(
      "One or more products in your cart no longer exist.",
      404,
      "PRODUCT_NOT_FOUND",
    );
  }

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  let totalAmountCents = 0;

  const orderItems = cartItems.map((item) => {
    const product = productMap.get(item.productId);

    if (product.stock < item.quantity) {
      throw new ApiError(
        `${product.name} does not have enough stock.`,
        400,
        "INSUFFICIENT_STOCK",
      );
    }

    const unitPriceCents = Math.round(product.price * 100);
    const lineTotalCents = unitPriceCents * item.quantity;

    totalAmountCents += lineTotalCents;

    return {
      product: product._id,
      name: product.name,
      unitPrice: unitPriceCents / 100,
      quantity: item.quantity,
      lineTotal: lineTotalCents / 100,
    };
  });

  if (totalAmountCents <= 0) {
    throw new ApiError(
      "Order total must be greater than zero.",
      400,
      "INVALID_TOTAL",
    );
  }

  const order = await Order.create({
    user: req.user?._id || null,
    isGuest: !req.user,
    items: orderItems,
    totalPrice: totalAmountCents / 100,
    totalAmountCents,
    currency: "usd",
    paymentStatus: "pending",
  });

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: totalAmountCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order._id.toString(),
        userId: req.user?._id?.toString() || "guest",
      },
    },
    {
      idempotencyKey: `order_${order._id.toString()}`,
    },
  );

  order.stripePaymentIntentId = paymentIntent.id;
  await order.save();

  res.status(200).json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
    orderId: order._id,
    amount: totalAmountCents / 100,
    currency: "usd",
  });
});

async function handlePaymentSucceeded(paymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    throw new Error("PaymentIntent is missing orderId metadata.");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);

      if (!order) {
        throw new Error(
          `Order not found for PaymentIntent ${paymentIntent.id}`,
        );
      }

      if (order.paymentStatus === "paid") {
        return;
      }

      if (order.totalAmountCents !== paymentIntent.amount) {
        order.paymentStatus = "failed";
        await order.save({ session });

        throw new Error(
          `Payment amount mismatch. Order expected ${order.totalAmountCents}, Stripe sent ${paymentIntent.amount}.`,
        );
      }

      for (const item of order.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            returnDocument: "after",
            session,
          },
        );

        if (!updatedProduct) {
          throw new Error(
            `Insufficient stock while fulfilling order ${order._id} for product ${item.product}`,
          );
        }
      }

      order.paymentStatus = "paid";
      order.stripePaymentIntentId = paymentIntent.id;
      order.paidAt = new Date();

      await order.save({ session });
    });
  } finally {
    await session.endSession();
  }
}

async function handlePaymentFailed(paymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) return;

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "failed",
    stripePaymentIntentId: paymentIntent.id,
  });
}

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;

    case "charge.succeeded": {
      const charge = event.data.object;

      if (charge.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          charge.payment_intent,
        );

        await handlePaymentSucceeded(paymentIntent);
      }

      break;
    }

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return res.status(200).json({
    status: "success",
    received: true,
  });
});
