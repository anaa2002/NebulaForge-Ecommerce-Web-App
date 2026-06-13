import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import api from "../api/axios";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage() {
  const { cartSubtotal, cart } = useCart();

  const [clientSecret, setClientSecret] = useState("");
  const [serverTotal, setServerTotal] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      setClientSecret("");
      setServerTotal(null);
      return;
    }

    let ignore = false;

    async function fetchClientSecret() {
      try {
        setCheckoutError("");
        setClientSecret("");

        const cartItems = cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        }));

        const response = await api.post("/payment/create-payment-intent", {
          cartItems,
        });

        if (ignore) return;

        setClientSecret(response.data.clientSecret);
        setServerTotal(response.data.amount);
      } catch (error) {
        if (ignore) return;

        console.error("Failed to create Stripe PaymentIntent:", error);

        setCheckoutError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Checkout failed. Please try again.",
        );
      }
    }

    fetchClientSecret();

    return () => {
      ignore = true;
    };
  }, [cart]);

  const appearance = { theme: "night" };
  const options = { clientSecret, appearance };

  const displayedTotal = serverTotal ?? cartSubtotal;

  return (
    <main
      className="checkout-container"
      style={{ padding: "100px 5%", maxWidth: "600px", margin: "0 auto" }}
    >
      <h1>Secure Checkout</h1>

      <p>Total to pay: ${displayedTotal.toFixed(2)}</p>

      {checkoutError && (
        <p className="error-message" style={{ marginTop: "1rem" }}>
          {checkoutError}
        </p>
      )}

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
        !checkoutError && <p>Establishing secure connection to Stripe...</p>
      )}
    </main>
  );
}

export default CheckoutPage;
