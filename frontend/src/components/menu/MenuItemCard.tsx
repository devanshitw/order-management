import { useState } from 'react';
import { MenuItem } from '../../types';

interface Props {
  item: MenuItem;
  onAddToCart: (itemId: string, quantity: number) => void;
}

export default function MenuItemCard({ item, onAddToCart }: Props) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="card overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300 font-bold bg-gradient-to-br from-gray-50 to-gray-100">
            {item.name[0]}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary-800 shadow-md">
          ₹{Number(item.price).toFixed(0)}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary-800">
            ₹{Number(item.price).toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border-2 border-primary-700 text-primary-700 font-bold hover:bg-primary-50 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full border-2 border-primary-700 text-primary-700 font-bold hover:bg-primary-50 active:scale-90 transition-all flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => onAddToCart(item.id, quantity)}
          className="w-full btn-primary py-2.5 text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
