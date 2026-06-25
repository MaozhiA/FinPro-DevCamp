import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

    
          <div className="col-span-2 md:col-span-1">
            <p className="font-bold text-[#001580] text-lg mb-3">FinPro</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Financial solutions designed around your life — insurance,
              investments, and device contracts in one place.
            </p>
          </div>

 
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Products</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-500 hover:text-[#001580] transition">
                  Device Contracts
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-500 hover:text-[#001580] transition">
                  Insurance
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-500 hover:text-[#001580] transition">
                  Investments
                </Link>
              </li>
            </ul>
          </div>

          
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Company</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="text-gray-500 hover:text-[#001580] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-[#001580] transition">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-[#001580] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

      
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Support</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-gray-500 hover:text-[#001580] transition">
                  Help centre
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-[#001580] transition">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-[#001580] transition">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400">
            © {year} InsureTechGuard. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
          InsureTechGuard is an NCR regulated and registered credit provider.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;