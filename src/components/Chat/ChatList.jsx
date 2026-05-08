import { useContext, useState } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import LoadingSpinner from './LoadingSpinner';

const ChatList = ({ chats, selectedChat, onSelectChat, isLoading }) => {
  const { state, setFilter, setSearchQuery, resetFilters } = useContext(ChatContext);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = ['all', 'open', 'in_progress', 'resolved', 'closed', 'escalated'];
  const priorityOptions = ['all', 'low', 'medium', 'high', 'urgent'];
  const categoryOptions = ['all', 'sales', 'support', 'technical', 'billing', 'general', 'complaint', 'feedback'];
  const userTypeOptions = ['all', 'consumer', 'producer', 'wholesaler', 'superseller'];

  const filteredChats = chats.filter((chat) => {
    const lastMessageText =
      typeof chat.lastMessage === 'string'
        ? chat.lastMessage
        : chat.lastMessage?.content || '';
    const matchesStatus = state.filters.status === 'all' || chat.status === state.filters.status;
    const matchesPriority = state.filters.priority === 'all' || chat.priority === state.filters.priority;
    const matchesCategory = state.filters.category === 'all' || chat.category === state.filters.category;
    const matchesUserType = state.filters.userType === 'all' || chat.userType === state.filters.userType;
    const matchesSearch =
      state.searchQuery === '' ||
      chat.subject?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      chat.user?.name?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      lastMessageText.toLowerCase().includes(state.searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesCategory && matchesUserType && matchesSearch;
  });

  const handleFilterChange = (filterKey, value) => {
    setFilter(filterKey, value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats, users, messages..."
              value={state.searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <FaFilter size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Filters</h3>
            <button
              onClick={resetFilters}
              className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={state.filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select
                value={state.filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                value={state.filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* User Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">User Type</label>
              <select
                value={state.filters.userType}
                onChange={(e) => handleFilterChange('userType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {userTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Chat Count */}
      <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
        Showing {filteredChats.length} of {chats.length} chats
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaTimes size={32} className="mb-2" />
            <p>No chats found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?._id === chat._id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
                  {chat.user?.name?.charAt(0) || 'U'}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{chat.user?.name || 'Unknown'}</h3>
                    {(chat.createdAt || chat.startedAt) && (
                      <span className="text-xs text-gray-500">
                        {new Date(chat.createdAt || chat.startedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 truncate mb-2">{chat.subject || 'No subject'}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={chat.status} size="sm" />
                    <StatusBadge priority={chat.priority} size="sm" />
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {chat.category}
                    </span>
                  </div>

                  {/* Last Message Preview */}
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {typeof chat.lastMessage === 'string'
                        ? chat.lastMessage
                        : chat.lastMessage?.content}
                    </p>
                  )}
                </div>

                {/* Unread Badge */}
                {chat.unreadCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
