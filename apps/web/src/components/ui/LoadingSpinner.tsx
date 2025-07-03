const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-gray-700 rounded-full animate-spin border-t-blue-500"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;