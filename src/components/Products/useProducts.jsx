import { useEffect, useState } from "react";
import axios from "axios";
import { categorizeProduct } from "../../utils/cat-prod";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/client/v1/products");

        const enriched = res.data.map((p) => ({
          ...p,
          category: categorizeProduct(p),
        }));

        setProducts(enriched);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};