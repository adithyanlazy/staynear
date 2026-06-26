import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmColor = 'red' }) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600',
    primary: 'bg-primary-500 hover:bg-primary-600',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl max-w-md w-full sm:p-6 p-5 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 ml-14 sm:ml-16 text-sm sm:text-base">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 rounded-xl text-white font-medium transition-colors text-sm ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
