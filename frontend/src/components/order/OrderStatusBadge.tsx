import { OrderStatus } from '../../types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PLACED]: 'bg-blue-500 text-white',
  [OrderStatus.CONFIRMED]: 'bg-purple-500 text-white',
  [OrderStatus.PREPARING]: 'bg-orange-500 text-white',
  [OrderStatus.OUT_FOR_DELIVERY]: 'bg-cyan-500 text-white',
  [OrderStatus.DELIVERED]: 'bg-green-500 text-white',
  [OrderStatus.CANCELLED]: 'bg-red-500 text-white',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PLACED]: 'Placed',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PREPARING]: 'Preparing',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`badge ${STATUS_STYLES[status] || 'bg-gray-500 text-white'} shadow-sm`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
