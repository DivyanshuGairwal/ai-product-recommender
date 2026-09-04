import { useState } from "react";
import { products } from "./products";
import "./index.css";

function App() {
  const [preference, setPreference] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendations = async () => {
    if (!preference.trim()) return;

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preference,
          products,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();

      setRecommendations(data.recommendations || []);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>AI Product Finder</h1>

        <p className="subtitle">
          Describe what you need and AI will find the best products for you.
        </p>

        <div className="search-box">
          <textarea
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="Example: I want a phone under $500 with a good camera..."
          />

          <button onClick={getRecommendations} disabled={loading}>
            {loading ? "Finding..." : "Find Products"}
          </button>
        </div>

        <h2>Available Products</h2>

        <div className="products">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>

              <span>{product.category}</span>

              <p>{product.description}</p>

              <div className="product-bottom">
                <strong>${product.price}</strong>
                <span>⭐ {product.rating}</span>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <p className="status">
            AI is finding the best matches...
          </p>
        )}

        {error && <p className="error">{error}</p>}

        {recommendations.length > 0 && (
          <>
            <h2>✨ AI Recommendations</h2>

            <div className="products">
              {recommendations.map((recommendation) => {
                const product = products.find(
                  (p) => p.id === recommendation.productId
                );

                if (!product) return null;

                return (
                  <div
                    className="product-card recommended"
                    key={product.id}
                  >
                    <h3>{product.name}</h3>

                    <p>{recommendation.reason}</p>

                    <div className="product-bottom">
                      <strong>${product.price}</strong>
                      <span>⭐ {product.rating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;