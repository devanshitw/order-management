import { Category } from '../../types';

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect(null)}
        className={`px-5 py-2.5 rounded-full font-medium transition-all active:scale-95 ${
          selected === null
            ? 'bg-primary-800 text-white shadow-md'
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:text-primary-800'
        }`}
      >
        All Dishes
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-5 py-2.5 rounded-full font-medium transition-all active:scale-95 ${
            selected === cat.id
              ? 'bg-primary-800 text-white shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:text-primary-800'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
