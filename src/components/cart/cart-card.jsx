const CartCard = ({ product, handleRemoveFromCart }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex">
      <div className="w-32 h-32 flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900">
            <p className="text-xs font-bold text-white text-center px-2">
              {product.name}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{product.name}</h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-slate-900">R {product.price}</span>
          <button
            onClick={() => handleRemoveFromCart(product.id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartCard;
