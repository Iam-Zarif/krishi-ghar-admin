import { useContext, useState, useRef, useEffect } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import {
  FaEllipsisV,
  FaArrowLeft,
  FaCheckDouble,
  FaPaperPlane,
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
  const statusLabel = (value) =>
    String(value || '').replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const isAdminMessage = (msg) =>
    msg.senderRole === 'admin' || msg.sender?.role === 'admin' || msg.senderType === 'admin';

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
      setMessages(response.data?.data?.messages || response.data?.messages || []);
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
        messageType: 'text',
      });
      const nextMessage = response.data?.data || response.data?.message;
      if (nextMessage) addMessage(nextMessage);
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
      if (newStatus === 'in_progress') {
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
      toast.success(`Chat marked as ${statusLabel(newStatus)}`);
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
      <div className="flex h-full min-h-[620px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
        <p className="text-sm text-gray-400">Select a chat to start</p>
      </div>
    );
  }

  const messages = state.messages || [];

  return (
    <div className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onBack}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <FaArrowLeft />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-semibold">
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
            className="rounded-lg bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition hover:bg-green-100 cursor-pointer"
          >
            {statusLabel(chat.status)}
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                onClick={() => handleStatusChange('in_progress')}
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
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
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
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
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
          {(chat.createdAt || chat.startedAt) && (
            <span className="font-semibold text-gray-800">
              {new Date(chat.createdAt || chat.startedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        {chat.subject && (
          <div className="text-sm w-full">
            <span className="text-gray-600">Subject: </span>
            <span className="font-semibold text-gray-800">{chat.subject}</span>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-[#f7f9f6] px-4 py-5">
        {isLoading ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const adminMessage = isAdminMessage(msg);
              const systemMessage = msg.messageType === 'system' || msg.isSystemMessage;
              const content = msg.content || msg.text || 'Message unavailable';

              if (systemMessage) {
                return (
                  <div key={msg._id} className="flex justify-center">
                    <span className="max-w-[80%] rounded-full bg-white px-3 py-1 text-center text-xs text-gray-500 shadow-sm">
                      {content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg._id}
                  className={`flex ${adminMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm lg:max-w-[58%] ${
                      adminMessage
                        ? 'rounded-br-md bg-green-600 text-white'
                        : 'rounded-bl-md border border-gray-200 bg-white text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">{content}</p>
                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                        adminMessage ? 'text-green-50' : 'text-gray-400'
                      }`}
                    >
                      {msg.createdAt && (
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                      {adminMessage && <FaCheckDouble size={11} />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !messageText.trim()}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white transition hover:bg-green-700 disabled:bg-gray-300 cursor-pointer"
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
