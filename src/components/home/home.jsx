import { Link } from 'react-router-dom';
import Carousel from '../carousel/carousel.jsx';
import ProductCard from '../product-card.jsx';
import { recommendedProducts } from '../../data/mock-data';

const featuredProducts = recommendedProducts.slice(0, 3);

const serviceCategories = [
  {
    id: 1,
    title: 'Device Contracts',
    description: 'Get the latest devices on flexible payment plans with comprehensive coverage included.',
  },
  {
    id: 2,
    title: 'Insurance',
    description: 'Protect yourself and your assets with comprehensive insurance solutions tailored to your needs.',
  },
  {
    id: 3,
    title: 'Investments',
    description: 'Grow your wealth with investment plans designed to help you achieve your financial goals.',
  },
];

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <Carousel />

       
            <section className="mt-16 mb-16">
              <div className="mb-12">
                <p className=" flex text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500 mb-3">
                  What we offer
                </p>
                <h2 className="flex text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
                  Our main financial solutions
                </h2>
                <p className="flex text-slate-600 max-w-2xl mx-auto">
                  Find what you need by browsing our services and solutions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {serviceCategories.map((category) => (
                  <Link
                    key={category.id}
                    to="/products"
                    className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-sky-300"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <div className="text-sky-600 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      Explore <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-10">
                <div className="space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0">
                    <div className="max-w-2xl">
                        <p className="flex text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500 mb-2">
                            Popular products
                        </p>
                        <h2 className="flex text-2xl font-semibold text-slate-900 sm:text-3xl">
                            Explore a small selection of useful offers.
                        </h2>
                        <p className="flex mt-3 text-sm text-slate-500 leading-relaxed">
                            A light overview of savings, insurance and borrowing solutions.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        View all products
                    </Link>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 mb-2">
                                Save & Invest
                            </p>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {product.name}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                                {product.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-700">
                                <span className="font-semibold">R {product.price}</span>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="text-sky-600 hover:text-sky-700"
                                >
                                    Learn more
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                
            </section>
        </div>
    );
};

export default Home;

