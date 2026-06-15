import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FallbackImage from '../../assets/inv1.jpg';

const CATEGORIES = ["all", "insurance", "investments", "device contracts"];

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    axios
      .get('/client/v1/products')
      .then((response) => setData(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = selectedCategory === "all"
    ? data
    : data.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
  <div className="bg-slate-50 min-h-screen">

    <div className="max-w-6xl mx-auto px-6 py-10">
      
      {/* Filter buttons */}
      <div className="flex gap-3 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition
              ${selectedCategory === cat
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-slate-500">Loading products...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-slate-500">No products found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col"
            >
         
              <div className="h-36 bg-slate-100 flex items-center justify-center">
                <img
                  src={product.imageUrl || FallbackImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                {product.category && (
                  <p className="text-xs font-medium uppercase tracking-wide text-sky-600 mb-1">
                    {product.category}
                  </p>
                )}
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-500 leading-5 line-clamp-2 flex-1">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    R {product.price}
                  </span>
                  <span className="text-xs text-sky-600 font-medium">
                    View details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default Products;