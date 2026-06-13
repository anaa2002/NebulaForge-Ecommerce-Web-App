import stripe from "../config/stripe.js";
import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { cartTotal, cartItems } = req.body;
  const travelerId = req.user ? req.user._id.toString() : "guest";
  const amountInCents = Math.round(cartTotal * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: {
      userId: travelerId.toString(),
      cartItems: JSON.stringify(cartItems),
    },
  });

  res.status(200).json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
  });
});

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

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const travelerId = paymentIntent.metadata.userId;
    const purchasedItems = JSON.parse(paymentIntent.metadata.cartItems);
    try {
      await Order.create({
        user: travelerId === "guest" ? null : travelerId,
        isGuest: travelerId === "guest",
        items: purchasedItems,
        totalPrice: paymentIntent.amount / 100,
        stripePaymentId: paymentIntent.id,
      });

      for (const item of purchasedItems) {
        await Product.findByIdAndUpdate(item._id, {
          $inc: { stock: -item.quantity },
        });
      }
    } catch (error) {
      console.error("Critical Error: Failed to save to database:", error);
    }
    console.log(
      "STRIPE SAYS: Payment succeeded for amount:",
      paymentIntent.amount,
    );
  }

  res.status(200).json({ status: "success", recieved: true });
});
