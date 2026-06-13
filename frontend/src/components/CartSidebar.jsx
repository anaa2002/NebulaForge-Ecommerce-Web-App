import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";

function CartSidebar() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
  } = useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "open" : ""}`}
        onClick={closeCart}
      >
        <aside className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
          <div className="cart-sidebar__header">
            <h2>Your Cargo Bay</h2>
            <button className="close-btn" onClick={closeCart}>
              &#10005;
            </button>
          </div>

          <div className="cart-sidebar__items">
            {cart.length === 0 ? (
              <p className="empty-cart-msg">
                Your cargo bay is currently empty, traveler.
              </p>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item__img"
                  />
                  <div className="cart-item__details">
                    <h4>{item.name}</h4>
                    <p className="cart-item__price">${item.price.toFixed(2)}</p>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    &#128465;
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-sidebar__footer">
              <div className="subtotal-row">
                <span>Subtotal:</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                className="btn btn--primary checkout-btn"
                onClick={closeCart}
              >
                Proceed to Stripe Checkout
              </Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export default CartSidebar;
