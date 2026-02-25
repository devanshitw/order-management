import { OrderStatus } from '../../types';

const STEPS = [
  { status: OrderStatus.PLACED, label: 'Placed', icon: '📝', emoji: '✅' },
  { status: OrderStatus.CONFIRMED, label: 'Confirmed', icon: '✅', emoji: '👨‍🍳' },
  { status: OrderStatus.PREPARING, label: 'Preparing', icon: '👨‍🍳', emoji: '🚚' },
  { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: '🚚', emoji: '🎉' },
  { status: OrderStatus.DELIVERED, label: 'Delivered', icon: '🎉', emoji: '' },
];

const STATUS_ORDER = STEPS.map((s) => s.status);

export default function OrderStatusTimeline({
  currentStatus,
}: {
  currentStatus: OrderStatus;
}) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  const isCancelled = currentStatus === OrderStatus.CANCELLED;

  return (
    <div className="py-6 px-4">
      <div className="relative flex items-start justify-between max-w-4xl mx-auto">
        {STEPS.map((step, idx) => {
          const isCompleted = !isCancelled && idx <= currentIdx;
          const isCurrent = !isCancelled && idx === currentIdx;

          return (
            <div key={step.status} className="flex flex-col items-center flex-1 relative">
              {/* Connection Line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-1 -z-10 transition-all duration-500 ${
                    isCompleted && idx < currentIdx
                      ? 'bg-gradient-to-r from-green-500 to-green-400'
                      : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Status Dot/Icon */}
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                } ${
                  isCurrent
                    ? 'ring-4 ring-secondary-800 ring-offset-2 animate-pulse'
                    : ''
                }`}
              >
                <span className="text-2xl">{step.icon}</span>
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-800 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-800"></span>
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs sm:text-sm text-center font-medium transition-all duration-300 ${
                  isCompleted ? 'text-gray-900' : 'text-gray-500'
                } ${isCurrent ? 'font-bold text-gray-900' : ''}`}
              >
                {step.label}
              </span>

              {/* Checkmark for completed steps */}
              {isCompleted && !isCurrent && (
                <div className="mt-1 text-green-500 text-xs">✓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cancelled Badge */}
      {isCancelled && (
        <div className="mt-8 flex items-center justify-center">
          <div className="badge bg-red-100 text-red-800 border-2 border-red-300 px-6 py-3 text-base">
            <span className="mr-2">❌</span>
            <span className="font-bold">Order Cancelled</span>
          </div>
        </div>
      )}

      {/* Current Status Info */}
      {!isCancelled && currentIdx >= 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 border-2 border-primary-200 rounded-lg">
            <span className="text-2xl animate-bounce">{STEPS[currentIdx].icon}</span>
            <div className="text-left">
              <p className="text-xs text-gray-600 font-medium">Current Status</p>
              <p className="text-sm text-gray-900 font-bold">{STEPS[currentIdx].label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
