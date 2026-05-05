import { useEffect, useState } from 'react';
import { FaComments, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { chatAPI } from '../../Api/chatAPI';
import { toast } from 'react-toastify';

const StatCard = ({ icon: Icon, title, value, unit = '', color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4 flex items-start gap-4`}>
      <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'yellow' ? 'bg-yellow-100' : color === 'red' ? 'bg-red-100' : 'bg-purple-100'}`}>
        <Icon className={`${iconColorClasses[color]} text-2xl`} />
      </div>
      <div className="flex-1">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          {value} <span className="text-lg text-gray-500">{unit}</span>
        </p>
      </div>
    </div>
  );
};

const ChatDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chat Statistics</h2>
        <p className="text-gray-600 text-sm mt-1">Overview of chat management metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={FaComments}
          title="Total Active Chats"
          value={stats?.totalActive || 0}
          color="blue"
        />

        <StatCard
          icon={FaClock}
          title="Average Response Time"
          value={Math.round(stats?.averageResponseTime || 0)}
          unit="mins"
          color="yellow"
        />

        <StatCard
          icon={FaCheckCircle}
          title="Resolved Chats"
          value={stats?.resolved || 0}
          color="green"
        />

        <StatCard
          icon={FaExclamationTriangle}
          title="Unresolved Chats"
          value={stats?.unresolved || 0}
          color="red"
        />

        <StatCard
          icon={FaComments}
          title="Today's Volume"
          value={stats?.todayVolume || 0}
          color="purple"
        />

        {stats?.byStatus?.escalated > 0 && (
          <StatCard
            icon={FaTimesCircle}
            title="Escalated Chats"
            value={stats.byStatus.escalated}
            color="red"
          />
        )}
      </div>

      {/* Status Breakdown */}
      {stats?.byStatus && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat Status Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 font-medium capitalize">{status}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;
