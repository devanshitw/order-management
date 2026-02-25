import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white hover:text-gray-100 transition-colors no-underline"
          >
            <span className="text-3xl"><img src="https://dcassetcdn.com/design_img/1762714/190740/190740_9544876_1762714_e77aaf83_image.jpg" alt="Logo" className="w-8 h-8" /></span>
            <span className="hidden sm:inline">Click and Eat</span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/menu"
              className="text-white hover:text-gray-200 font-medium transition-colors no-underline"
            >
              Menu
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative text-white hover:text-gray-200 font-medium transition-colors no-underline flex items-center gap-1"
                >
                  <span>🛒</span>
                  <span className="hidden sm:inline">Cart</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary-800 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  className="text-white hover:text-gray-200 font-medium transition-colors no-underline hidden sm:inline"
                >
                  Orders
                </Link>

                <div className="hidden md:flex items-center gap-2 pl-4 border-l border-primary-600">
                  <span className="text-sm">👤</span>
                  <span className="text-white font-medium text-sm">{user?.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-primary-800 transition-all active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 font-medium transition-colors no-underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all active:scale-95 no-underline"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
