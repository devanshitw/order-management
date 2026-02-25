import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../api/order.api';
import { Order, OrderStatus } from '../types';
import OrderStatusTimeline from '../components/order/OrderStatusTimeline';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const fetchOrder = () => {
    if (!id) return;
    orderApi
      .getOrder(id)
      .then((res) => setOrder(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Poll for status updates
  useEffect(() => {
    if (
      !order ||
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      return;
    }

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [order?.status, id]);

  const handleSimulate = async () => {
    if (!id) return;
    setSimulating(true);
    try {
      await orderApi.simulate(id);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {order.order_number}
            </h1>
            <p className="text-gray-600 text-sm">Order placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="mt-6">
          <OrderStatusTimeline currentStatus={order.status} />
        </div>

        {/* Simulate Button */}
        {order.status !== OrderStatus.DELIVERED &&
          order.status !== OrderStatus.CANCELLED && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-button disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {simulating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Simulating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    ⚡ Simulate Status Progression
                  </span>
                )}
              </button>
            </div>
          )}
      </div>

      {/* Order Details */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📝 Order Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm text-gray-600 font-medium">Placed</p>
              <p className="text-gray-900">
                {new Date(order.created_at).toLocaleString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {order.estimated_delivery_at && (
            <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg border border-secondary-200">
              <span className="text-xl">🚚</span>
              <div>
                <p className="text-sm text-secondary-800 font-medium">Estimated Delivery</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(order.estimated_delivery_at).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}

          {order.delivery_address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-sm text-gray-600 font-medium">Delivery Address</p>
                <p className="text-gray-900">{order.delivery_address}</p>
              </div>
            </div>
          )}

          {order.notes && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-xl">💬</span>
              <div>
                <p className="text-sm text-blue-800 font-medium">Special Instructions</p>
                <p className="text-gray-900">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      {order.items && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🍽️ Order Items
          </h3>
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex justify-between items-center py-3 ${
                  index !== (order.items?.length ?? 0) - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary-50 text-primary-800 rounded-full text-sm font-bold">
                    {item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {item.menu_item?.name || 'Item'}
                  </span>
                </div>
                <span className="text-gray-900 font-semibold">
                  ₹{Number(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200 space-y-2">
            {order.discount_amount && Number(order.discount_amount) > 0 ? (
              <>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{(Number(order.total_amount) + Number(order.discount_amount)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <span className="flex items-center gap-2">
                    🎉 Discount {order.coupon_code && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                        {order.coupon_code}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold">
                    -₹{Number(order.discount_amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-2xl text-primary-800">
                    ₹{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-2xl text-primary-800">
                  ₹{Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
