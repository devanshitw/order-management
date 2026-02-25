export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-800 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
          🍽️
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading...</p>
    </div>
  );
}
