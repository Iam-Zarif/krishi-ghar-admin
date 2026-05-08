const StatusBadge = ({ status, priority, size = 'sm' }) => {
  const statusColors = {
    open: 'bg-blue-100 text-blue-800 border-blue-300',
    in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
    closed: 'bg-gray-100 text-gray-800 border-gray-300',
    escalated: 'bg-red-100 text-red-800 border-red-300',
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  if (status) {
    return (
      <span
        className={`inline-flex items-center rounded-full border font-medium ${
          statusColors[status] || statusColors.open
        } ${sizeClasses[size]}`}
      >
        <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-70"></span>
        {status.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
      </span>
    );
  }

  if (priority) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-medium ${
          priorityColors[priority] || priorityColors.medium
        } ${sizeClasses[size]}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  }

  return null;
};

export default StatusBadge;
