import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from '../../assets/26.png';

const Products = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('/client/v1/products')
      .then((response) => {
        console.log('API DATA:', response.data);
        setData(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 w-full px-8 lg:px-24 py-8">
      <div className="w-full space-y-8">
        <header className="space-y-4">
          <div>

            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Investment product catalogue</h1>
          
          </div>
        </header>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group overflow-hidden rounded-[22px] border border-slate-400 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={Image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-2xl bg-sky-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  New
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">{product.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">R {product.price}</span>
                  <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white">
                    View details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;