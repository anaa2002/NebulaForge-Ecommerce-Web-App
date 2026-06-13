import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";

function Navbar() {
  const { user, logout } = useAuth();

  const { openCart, totalItemsCount, clearCart } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Nebula-Forge</Link>
      </div>

      <div className="navbar__links">
        <button className="btn btn--outline" onClick={openCart}>
          Cargo ({totalItemsCount})
        </button>

        {user ? (
          <button
            className="btn btn--secondary"
            onClick={() => {
              logout();
              clearCart();
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn--secondary">
              Login
            </Link>
            <Link to="/signup" className="btn btn--primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
