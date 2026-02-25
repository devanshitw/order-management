import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/order.api';
import { offerApi } from '../api/offer.api';
import { Offer, DiscountType } from '../types';

export default function CheckoutPage() {
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  // Coupon state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [couponInput, setCouponInput] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    fetchCart();
    offerApi
      .getActiveOffers()
      .then((res) => setOffers(Array.isArray(res?.offers) ? res.offers : []))
      .catch(() => {});
  }, [fetchCart]);

  const subtotal = cart?.total_amount ?? 0;

  const calculateDiscount = (offer: Offer, amount: number): number => {
    let discount: number;
    if (offer.discount_type === DiscountType.PERCENTAGE) {
      discount = (amount * Number(offer.discount_value)) / 100;
    } else {
      discount = Number(offer.discount_value);
    }
    return Math.min(Number(discount.toFixed(2)), amount);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const offer = offers.find(
      (o) => o.coupon_code && o.coupon_code.toUpperCase() === code,
    );

    if (!offer) {
      setCouponError('Invalid or expired coupon code');
      return;
    }

    if (subtotal < Number(offer.min_order_amount)) {
      setCouponError(
        `Minimum order amount is ₹${Number(offer.min_order_amount)}`,
      );
      return;
    }

    const discount = calculateDiscount(offer, subtotal);
    setAppliedOffer(offer);
    setDiscountAmount(discount);
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedOffer(null);
    setDiscountAmount(0);
    setCouponInput('');
    setCouponError('');
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600">Add items from the menu first.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    setSubmitting(true);
    try {
      const res = await orderApi.placeOrder({
        delivery_address: address.trim(),
        notes: notes.trim() || undefined,
        coupon_code: appliedOffer?.coupon_code || undefined,
      });
      navigate(`/orders/${res.order.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">💳 Checkout</h1>

      {/* Order Summary */}
      <div className="card p-6 mb-6 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          📋 Order Summary
        </h3>
        <div className="space-y-2 mb-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 text-sm">
              <span className="text-gray-700">
                <span className="font-medium">{item.menu_item.name}</span>
                <span className="text-gray-500"> × {item.quantity}</span>
              </span>
              <span className="font-semibold text-gray-900">
                ₹{(Number(item.unit_price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center py-3 border-t border-gray-200 font-semibold">
          <span className="text-gray-700">Subtotal</span>
          <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {appliedOffer && discountAmount > 0 && (
          <div className="flex justify-between items-center py-2 text-green-700">
            <span className="font-medium">
              Discount ({appliedOffer.coupon_code})
            </span>
            <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-300 text-lg font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-primary-800 text-xl">₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="card p-6 mb-6 border-2 border-dashed border-secondary-200">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          🎟️ Have a coupon?
        </h3>
        {!appliedOffer ? (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
                className="input-field flex-1 uppercase text-sm"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="btn-secondary px-5 py-2.5 text-sm whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                ⚠️ {couponError}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-green-50 p-4 rounded-lg">
            <span className="text-green-700 font-semibold flex items-center gap-2">
              ✅ {appliedOffer.coupon_code} applied — you save ₹{discountAmount.toFixed(2)}!
            </span>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-sm px-4 py-1.5 border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 active:scale-95 transition-all"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-700 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Delivery Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🚚 Delivery Details
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete delivery address"
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions for your order?"
            className="input-field min-h-[100px] resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full text-lg py-4"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Placing Order...
            </span>
          ) : (
            `Place Order - ₹${finalTotal.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
}
