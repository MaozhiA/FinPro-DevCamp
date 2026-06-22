import ProductCard from "../product-card.jsx";
import { recommendedProducts } from "../../data/mock-data";
import { Link } from "react-router-dom";

const RecommendedPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex text-3xl font-semibold">Recommended Products</h1>
          <p className="flex text-slate-500 mt-2">
            Explore all products picked for you based on your activity.
          </p>
        </div>
        {/* <Link
          to="/home"
          className="inline-flex items-center 
          rounded-full border border-slate-200 
          bg-white px-4 py-2 text-sm font-medium text-slate-700 
          shadow-sm transition hover:bg-slate-50"
        >
          Back to home
        </Link> */}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedPage;
