import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useCart } from "../context/cartContext";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();

  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${import.meta.env.VITE_CLIENT_URL}/payment-success`,
      },
    });

    if (error) setErrorMessage(error.message);
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement id="payment-element" />

      {errorMessage && (
        <div className="error-message" style={{ marginTop: "1rem" }}>
          {errorMessage}
        </div>
      )}

      <button
        className="btn btn--primary"
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        style={{ marginTop: "2rem", width: "100%" }}
      >
        <span id="button-text">
          {isProcessing
            ? "Processing Hyper-Jump...."
            : "Confirm Secure Payment"}
        </span>
      </button>
    </form>
  );
}

export default CheckoutForm;
