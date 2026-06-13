import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

function HomePage() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Processors",
    "Cooling",
    "RAM",
    "Graphics Cards",
    "Storage",
    "Cases",
  ];

  useEffect(() => {
    async function fetchInventory() {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get("/products", {
          params: {
            search: debouncedSearch,
            category: selectedCategory || undefined,
            page: page,
            limit: 6,
          },
        });
        setTotalPages(Number(response.data.pagination.totalPages));
        setProducts(response.data.data);
      } catch (error) {
        const message =
          error.response?.data?.error ||
          "Failed to establish a link to the store grid.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInventory();
  }, [debouncedSearch, selectedCategory, page]);

  return (
    <main className="marketplace-container">
      <aside className="sidebar-filters">
        <div className="filter-group">
          <h3>Search Systems</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Search Nebula-Forge..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-group">
          <h3>Component Sectors</h3>
          <button
            className={`filter-chip ${selectedCategory === "" ? "active" : ""}`}
            onClick={() => setSelectedCategory("")}
          >
            All Sectors
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setSearch("");
                setPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>
      <section className="catalog-showroom">
        <header className="showroom-header">
          <div>
            <h1>Cosmic Marketplace</h1>
            <p className="eyebrow">
              {user
                ? `Welcome back, pilot ${user.username}`
                : "Browsing as Guest Traveler"}
            </p>
          </div>
          <span className="results-count">
            {products.length} hardware matrix lines loaded
          </span>
        </header>
        {isLoading && (
          <p className="loading-text">Syncrhonizing hardware registries...</p>
        )}
        {error && <p className="error-message">{error}</p>}

        {!isLoading && products.length === 0 && (
          <div className="empty-state">
            <p>
              No cosmic components match your current filter parameters in this
              grid sector.
            </p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="products-grid">
              {products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>

           
            <div className="pagination-controls">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn btn--secondary"
              >
                Previous Sector
              </button>

              <span className="page-indicator">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn--secondary"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next Sector 
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default HomePage;
