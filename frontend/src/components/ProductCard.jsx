import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";

function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart, openCart } = useCart();
  const { name, category, price, description, image, stock, manufacturer } =
    product;

  function handleAddTocart() {
    addToCart(product);
    openCart();
    console.log(`Transmitted ${name} to the Cargo Bay!`);
  }

  return (
    <article className="product-card">
      <div className="product-card__image-frame">
        <img src={image} alt={name} className="product-card__image" />
        <span className="product-card__tag">{category}</span>
      </div>

      <div className="product-card__content">
        <p className="product-card__manufacturer">{manufacturer}</p>
        <h3 className="product-card__title">{name}</h3>
        <p className="product-card__desc">{description}</p>
      </div>

      <div className="product-card__footer">
        <div className="product-card__metrics">
          <span className="product-card__price">${price.toFixed(2)}</span>
          <span
            className={`product-card__stock ${stock <= 3 ? "stock-low" : ""}`}
          >
            {stock === 0 ? "Out of Stock" : `${stock} remaining`}
          </span>
        </div>

        <button
          className="btn btn--primary product-card__btn"
          onClick={handleAddTocart}
          disabled={stock === 0}
        >
          {stock === 0 ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
