const StatsCard = ({ icon: Icon, label, value, change, changeType, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
    green: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="card p-3 sm:p-6 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-xs sm:text-sm mt-1 sm:mt-2 font-medium ${changeType === 'positive' ? 'text-emerald-500' : changeType === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
              {changeType === 'positive' ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className={`w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
