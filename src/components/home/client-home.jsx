import { Link } from "react-router-dom";
import ProductCard from "../product-card.jsx";
import { recommendedProducts, newArrivals } from "../../data/mock-data";
import Carousel from "../carousel/carousel.jsx";

const ClientHome = ({ user }) => {
  const visibleRecommended = recommendedProducts.slice(0, 3);
  const visibleNewArrivals = newArrivals.slice(0, 3);

  const firstName = user?.displayName?.split(' ')[0] || 'there';

//   const quickActions = [
//     { label: 'My Applications', icon: '📋', route: '/applications' },
//     { label: 'Active Contracts', icon: '📄', route: '/contracts' },
//     { label: 'Support', icon: '💬', route: '/support' },
//   ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
        <Carousel />
      {/* Welcome Section */}
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-600 text-lg mt-1">Here's what we've picked for you, {firstName}.</p>
      </div> */}

      {/* Quick Actions Strip */}
      {/* <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.route}
            className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="font-medium text-slate-900">{action.label}</span>
          </Link>
        ))}
      </div> */}

      {/* Recommended Section */}
      <div className="mb-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recommended for you</h2>
          </div>
          <Link
            to="/recommended"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            View all recommended
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleRecommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>


      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">New Arrivals</h2>
          </div>
          <Link
            to="/new-arrivals"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            View all new arrivals
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
