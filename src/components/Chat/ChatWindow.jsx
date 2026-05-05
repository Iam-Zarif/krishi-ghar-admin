import { useContext, useState, useRef, useEffect } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import {
  FaPaperclip,
  FaSmile,
  FaChevronDown,
  FaEllipsisV,
  FaArrowLeft,
  FaCheckDouble,
  FaTimes,
} from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import LoadingSpinner from './LoadingSpinner';
import { chatAPI } from '../../Api/chatAPI';
import { toast } from 'react-toastify';

const ChatWindow = ({ chat, onBack, onRefresh }) => {
  const { state, setMessages, addMessage, updateChatStatus } = useContext(ChatContext);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  useEffect(() => {
    if (chat?._id) {
      loadMessages();
    }
  }, [chat?._id]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getChatMessages(chat._id);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      setIsLoading(true);
      const response = await chatAPI.sendMessage(chat._id, {
        content: messageText,
        type: 'text',
      });
      addMessage(response.data.message);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === 'in-progress') {
        await chatAPI.markInProgress(chat._id);
      } else if (newStatus === 'resolved') {
        await chatAPI.resolveChat(chat._id);
      } else if (newStatus === 'closed') {
        await chatAPI.closeChat(chat._id);
      } else if (newStatus === 'escalated') {
        await chatAPI.escalateChat(chat._id);
      }
      updateChatStatus(chat._id, newStatus);
      setShowStatusMenu(false);
      toast.success(`Chat marked as ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await chatAPI.changePriority(chat._id, newPriority);
      toast.success('Priority updated');
      onRefresh();
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast.error('Failed to update priority');
    }
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-400">Select a chat to start</p>
      </div>
    );
  }

  const messages = state.messages || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onBack}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <FaArrowLeft />
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white font-semibold">
            {chat.user?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-800">{chat.user?.name || 'Unknown'}</h2>
            <p className="text-xs text-gray-500">{chat.userType}</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition"
          >
            Status: {chat.status}
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => handleStatusChange('in-progress')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleStatusChange('resolved')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleStatusChange('closed')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
              >
                Close Chat
              </button>
              <button
                onClick={() => handleStatusChange('escalated')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t border-gray-200"
              >
                Escalate
              </button>
            </div>
          )}

          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <FaEllipsisV />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-40">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Priority</p>
              {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => {
                    handlePriorityChange(priority);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Info Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-3 items-center">
        <div className="text-sm">
          <span className="text-gray-600">Category: </span>
          <span className="font-semibold text-gray-800">{chat.category}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Priority: </span>
          <StatusBadge priority={chat.priority} size="sm" />
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Created: </span>
          <span className="font-semibold text-gray-800">
            {new Date(chat.createdAt).toLocaleDateString()}
          </span>
        </div>
        {chat.subject && (
          <div className="text-sm w-full">
            <span className="text-gray-600">Subject: </span>
            <span className="font-semibold text-gray-800">{chat.subject}</span>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {isLoading ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.senderType === 'admin'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {msg.senderType === 'admin' && (
                    <div className="flex items-center gap-1 mt-1 text-blue-100">
                      <FaCheckDouble size={12} />
                      {msg.readAt && <span>read</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 bg-white"
      >
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 flex-shrink-0"
          >
            <FaPaperclip size={18} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 flex-shrink-0"
          >
            <FaSmile size={18} />
          </button>

          <button
            type="submit"
            disabled={isLoading || !messageText.trim()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex-shrink-0"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
