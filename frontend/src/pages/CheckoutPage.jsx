import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import api from "../api/axios";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage() {
  const { cartSubtotal, cart, setcartSubtotal } = useCart();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function fetchPasscode() {
      try {
        const response = await api.post("/payment/create-payment-intent", {
          cartTotal: cartSubtotal,
          cartItems: cart,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Failed to fetch Stripe passcode:", error);
      }
    }

    if (cartSubtotal > 0) {
      fetchPasscode();
    }
  }, [cartSubtotal]);

  const appearance = { theme: "night" };
  const options = { clientSecret, appearance };

  return (
    <main
      className="checkout-container"
      style={{ padding: "100px 5%", maxWidth: "600px", margin: "0 auto" }}
    >
      <h1>Secure Checkout</h1>
      <p>Total to pay: ${cartSubtotal.toFixed(2)}</p>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <div
            style={{
              marginTop: "2rem",
              padding: "2rem",
              background: "var(--bg-card-dark)",
              borderRadius: "8px",
            }}
          >
            <CheckoutForm />
          </div>
        </Elements>
      ) : (
        <p>Establishing secure connection to Stripe...</p>
      )}
    </main>
  );
}

export default CheckoutPage;
