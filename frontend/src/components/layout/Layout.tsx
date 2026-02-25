import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
              <span className="text-xl">🍽️</span>
              <span>Click and Eat</span>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Delicious food, delivered to your door
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
