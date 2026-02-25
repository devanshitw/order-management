import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuApi } from '../api/menu.api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Category, MenuItem } from '../types';
import CategoryFilter from '../components/menu/CategoryFilter';
import MenuItemCard from '../components/menu/MenuItemCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  useEffect(() => {
    menuApi.getCategories().then((cats) => {
      setCategories(Array.isArray(cats) ? cats : []);
    });
  }, []);

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError('');
    menuApi
      .getItems({
        category_id: selectedCategory || undefined,
        search: search || undefined,
      })
      .then((res) => {
        if (currentRequestId !== requestIdRef.current) return;
        setItems(Array.isArray(res?.items) ? res.items : []);
      })
      .catch((err) => {
        if (currentRequestId !== requestIdRef.current) return;
        console.error('Failed to fetch menu items:', err);
        setError('Failed to load dishes. Please try again.');
        setItems([]);
      })
      .finally(() => {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      });
  }, [selectedCategory, search]);

  const handleAddToCart = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addItem(itemId, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-4xl">🍽️</span> Our Menu
        </h1>
        <p className="text-gray-600">Browse our delicious vegetarian dishes</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for your favorite dish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 text-base"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </div>
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-red-600 font-semibold">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-600 font-semibold">No dishes found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
