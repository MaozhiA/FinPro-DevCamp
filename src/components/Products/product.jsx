import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../Products/useProducts.jsx";
import { CATEGORY_LIST } from "../../utils/cat-prod.jsx";

const categoryColors = {
  insurance: "from-slate-900 via-slate-700 to-slate-800",
  investments: "from-sky-800 via-sky-600 to-sky-700",
  "device contracts": "from-emerald-800 via-emerald-600 to-emerald-700",
  other: "from-slate-600 via-slate-500 to-slate-700",
};

const Products = () => {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;

    return products.filter(
      (p) => p.category === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

   
        {/* <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Products
          </h1>
          <p className="text-slate-500 text-sm">
            Browse available financial products
          </p>
        </div> */}

       
        <div className="flex gap-3 flex-wrap mb-8">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition
                ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>


        {loading && (
          <p className="text-slate-500">Loading products...</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="text-slate-500">No products found.</p>
        )}


        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const colorClass = categoryColors[product.category] || categoryColors.other;
            const placeholderLabel = product.name || "Product";

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition flex flex-col"
              >
                <div className="h-36 bg-slate-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${colorClass}`}>
                      <div className="rounded-2xl bg-white/85 px-4 py-2 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-800">
                          {placeholderLabel}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          No image available
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs font-medium uppercase text-sky-600 mb-1">
                    {product.category}
                  </p>

                  <h2 className="text-sm font-semibold text-slate-900 mb-1">
                    {product.name}
                  </h2>

                  <p className="text-xs text-slate-500 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                     From: R {product.price} / mo
                    </span>
                    <span className="text-xs text-sky-600 font-medium">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Products;