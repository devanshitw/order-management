import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/order.api';
import { Order } from '../types';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getOrders()
      .then((res) => setOrders(Array.isArray(res?.orders) ? res.orders : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start ordering delicious food from our menu!</p>
          <Link to="/menu" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Your Orders</h1>
        <p className="text-gray-600">Track and manage your order history</p>
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="card p-6 hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200 block no-underline"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 m-0">
                    {order.order_number}
                  </h3>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅</span>
                    <span>{new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="hidden sm:block text-gray-300">•</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🕒</span>
                    <span>{new Date(order.created_at).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center sm:items-end sm:flex-col gap-2">
                <span className="text-2xl font-bold text-primary-800">
                  ₹{Number(order.total_amount).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 ml-auto">View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
