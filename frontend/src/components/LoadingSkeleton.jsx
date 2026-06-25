const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="card overflow-hidden animate-pulse">
        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
