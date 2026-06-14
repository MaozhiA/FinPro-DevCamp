import {Link} from 'react-router-dom'

const Navbar = () => {

    return (
        <nav className="bg0white border-b border-slate-200 shadow-sm">
            <div className="mx-auto max-w-screen-2xl px-6">
                <div className="flex h-16 items-center justify-between">

                    <Link 
                    to="/"
                    className="text-xl font-bold text-slate-900"
                    >
                        FinPro
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link 
                        to="/products"
                        className="text-slate-600 hover:text-sky-600"
                        >
                            Products
                        </Link>

                         <Link 
                        to="/cart"
                        className="text-slate-600 hover:text-sky-600"
                        >
                            Cart
                        </Link>

                         <Link 
                        to="/subscriptions"
                        className="text-slate-600 hover:text-sky-600"
                        >
                            Subscriptions
                        </Link>

                         <Link 
                        to="/home"
                        className="text-slate-600 hover:text-sky-600"
                        >
                            Account
                        </Link>


                    </div>

                </div>
            </div>
        </nav>
    );
}; 
export default Navbar;