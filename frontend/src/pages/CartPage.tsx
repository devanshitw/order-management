import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CartPage() {
  const { cart, loading, fetchCart, updateItem, removeItem, clearCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading && !cart) return <LoadingSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Link to="/menu" className="btn-primary inline-block">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          🛒 Your Cart
          <span className="badge bg-primary-100 text-primary-800">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 active:scale-95 transition-all"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col gap-4 mb-8">
        {cart.items.map((item) => (
          <div key={item.id} className="card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.menu_item.name}
                </h3>
                <p className="text-sm text-gray-600">
                  ₹{Number(item.unit_price).toFixed(2)} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                <button
                  onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold text-gray-700"
                >
                  −
                </button>
                <span className="font-bold text-gray-900 min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateItem(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border-2 border-primary-500 bg-white hover:bg-primary-50 transition-all flex items-center justify-center font-bold text-primary-700"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 sm:min-w-[140px] justify-between sm:justify-end w-full sm:w-auto">
                <span className="text-lg font-bold text-gray-900">
                  ₹{(Number(item.unit_price) * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6">
          <span>Total:</span>
          <span className="text-2xl text-primary-800">₹{cart.total_amount.toFixed(2)}</span>
        </div>
        <Link
          to="/checkout"
          className="btn-primary w-full text-center block text-lg"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
