import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { offerApi } from '../api/offer.api';
import { menuApi } from '../api/menu.api';
import { orderApi } from '../api/order.api';
import { Offer, MenuItem, Order, DiscountType } from '../types';
import MenuItemCard from '../components/menu/MenuItemCard';
import OrderStatusBadge from '../components/order/OrderStatusBadge';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch all data in parallel
    offerApi
      .getActiveOffers()
      .then((res) => setOffers(Array.isArray(res?.offers) ? res.offers : []))
      .catch(() => {});

    menuApi
      .getRecommendations()
      .then((res) =>
        setRecommendations(Array.isArray(res?.items) ? res.items : []),
      )
      .catch(() => {});

    if (isAuthenticated) {
      orderApi
        .getOrders({ page: 1, limit: 3 })
        .then((res) =>
          setRecentOrders(Array.isArray(res?.orders) ? res.orders : []),
        )
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleAddToCart = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addItem(itemId, quantity);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Click And Eat
          </h1>
          <p className="text-lg sm:text-xl text-primary-50 mb-8 max-w-2xl mx-auto animate-slide-up">
            Delicious food just away from your fingertips. Explore our menu and order your favorites now!
          </p>
          <Link
            to="/menu"
            className="inline-block bg-white text-primary-800 px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-50 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            Order Now →
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Today's Deals */}
        {offers.length > 0 && (
          <section className="animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-4xl">🎉</span> Today's Deals
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="min-w-[280px] max-w-[320px] flex-shrink-0"
                >
                  <div className="card p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-300 hover:border-secondary-400 transition-all h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-secondary-800 text-white shadow-md">
                        {offer.discount_type === DiscountType.PERCENTAGE
                          ? `${Number(offer.discount_value)}% OFF`
                          : `₹${Number(offer.discount_value)} OFF`}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {offer.title}
                    </h3>
                    {offer.description && (
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                        {offer.description}
                      </p>
                    )}
                    {offer.coupon_code && (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-secondary-700 rounded-lg">
                          <span className="text-sm text-gray-600">Code:</span>
                          <span className="text-base font-mono font-bold text-secondary-800 tracking-wider">
                            {offer.coupon_code}
                          </span>
                        </div>
                      </div>
                    )}
                    {Number(offer.min_order_amount) > 0 && (
                      <p className="text-sm text-gray-600">
                        Min. order: ₹{Number(offer.min_order_amount)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-4xl">
                {isAuthenticated ? '✨' : '🔥'}
              </span>{' '}
              {isAuthenticated ? 'Recommended For You' : 'Popular Dishes'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
