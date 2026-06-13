import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/cartContext";

function PaymentSuccess() {
  const { clearCart } = useCart();

  const [searchParams] = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <main
      className="success-container"
      style={{ padding: "100px 5%", textAlign: "center" }}
    >
      <div
        className="success-card"
        style={{
          background: "var(--bg-card-dark)",
          padding: "4rem",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "var(--color-forge-cyan)",
            fontSize: "3rem",
            marginBottom: "1rem",
          }}
        >
          Transmission Successful!
        </h1>

        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
          Your cosmic hardware has been securely processed and is being prepped
          for hyper-jump delivery.
        </p>

        {paymentIntent && (
          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "2rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Official Transaction ID:
            </p>
            <p
              style={{
                fontFamily: "monospace",
                color: "var(--color-forge-cyan)",
              }}
            >
              {paymentIntent}
            </p>
          </div>
        )}

        <Link to="/" className="btn btn--primary">
          Return to Nebula-Forge
        </Link>
      </div>
    </main>
  );
}

export default PaymentSuccess;
