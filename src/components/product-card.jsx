import { Link } from "react-router-dom";
import { categorizeProduct } from "../utils/cat-prod.jsx";

const ProductCard = ({ product }) => {
  const productCategory = categorizeProduct(product);

  
  const categoryLabels = {
    'device contracts': 'Device',
    'insurance': 'Insurance',
    'investments': 'Investment',
    'other': 'Product',
  };

  const categoryColors = {
    'device contracts': { 
      badge: 'bg-emerald-100 text-emerald-700', 
      placeholder: 'bg-emerald-50' 
    },
    'insurance': { 
      badge: 'bg-slate-800 text-white', 
      placeholder: 'bg-slate-900' 
    },
    'investments': { 
      badge: 'bg-sky-100 text-sky-700', 
      placeholder: 'bg-sky-50' 
    },
    'other': { 
      badge: 'bg-slate-100 text-slate-700', 
      placeholder: 'bg-slate-50' 
    },
  };

  const colors = categoryColors[productCategory] || categoryColors.other;
  const categoryLabel = categoryLabels[productCategory] || 'Product';
  const priceDisplay = product.price === 0 ? 'Free' : `From R ${product.price} / mo`;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition duration-300 flex flex-col cursor-pointer"
    >

      <div className={`h-40 flex text-black items-center justify-center px-3 text-center ${colors.placeholder}`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full text-black w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-4">
            <p className="text-sm text-black font-medium opacity-70">{categoryLabel}</p>
          </div>
        )}
      </div>

   
      <div className="p-4 flex flex-col flex-grow">
     
        <div className="mb-2">
          <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${colors.badge}`}>
            {categoryLabel}
          </span>
        </div>

        <h3 className="text-sm text-black font-semibold text-slate-900 mb-2">{product.name}</h3>

      
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Footer: Price and CTA */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-base font-bold text-slate-900">{priceDisplay}</span>
          <span className="text-sm font-semibold text-sky-600 group-hover:text-sky-700 group-hover:gap-2 flex items-center gap-1 transition-all">
            View product
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

