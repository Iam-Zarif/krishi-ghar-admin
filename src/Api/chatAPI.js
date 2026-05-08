import axios from 'axios';
import { Api } from './Api';

const API_BASE_URL = `${Api}/api/v1`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Chat Management APIs
export const chatAPI = {
  // Get all chats with filters
  getAllChats: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.userType && filters.userType !== 'all') params.append('userType', filters.userType);
    if (filters.search) params.append('search', filters.search);

    return axios.get(`${API_BASE_URL}/chats/admin-chats?${params}`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Get chat details with messages
  getChatDetails: (chatId) => {
    return axios.get(`${API_BASE_URL}/chats/${chatId}`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Get chat messages
  getChatMessages: (chatId, limit = 50, skip = 0) => {
    const page = Math.floor(skip / limit) + 1;
    return axios.get(
      `${API_BASE_URL}/chats/messages/${chatId}?limit=${limit}&page=${page}`,
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Send message as admin
  sendMessage: (chatId, messageData) => {
    return axios.post(
      `${API_BASE_URL}/chats/send-message`,
      {
        chatId,
        ...messageData,
      },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Edit message
  editMessage: (messageId, content) => {
    return axios.put(
      `${API_BASE_URL}/chats/messages/${messageId}/edit`,
      { content },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Delete message
  deleteMessage: (messageId) => {
    return axios.delete(`${API_BASE_URL}/chats/messages/${messageId}`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Add reaction to message
  addReaction: (messageId, emoji) => {
    return axios.post(
      `${API_BASE_URL}/chats/messages/${messageId}/reactions`,
      { emoji },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Assign chat to admin
  assignChat: (chatId, adminId) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/assign`,
      { adminId },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Claim chat (self-assign)
  claimChat: (chatId) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/claim`,
      {},
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Transfer chat to another admin
  transferChat: (chatId, targetAdminId) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/transfer`,
      { targetAdminId },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Change chat priority
  changePriority: (chatId, priority) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/priority`,
      { priority },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Change chat category
  changeCategory: (chatId, category) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/category`,
      { category },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Mark chat as in-progress
  markInProgress: (chatId) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/in-progress`,
      {},
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Resolve chat
  resolveChat: (chatId) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/resolve`,
      {},
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Close chat
  closeChat: (chatId) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/close`,
      {},
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Escalate chat
  escalateChat: (chatId, level = 1) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/escalate`,
      { level },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Reopen closed chat
  reopenChat: (chatId) => {
    return axios.put(
      `${API_BASE_URL}/chats/${chatId}/reopen`,
      {},
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  },

  // Get chat statistics
  getStatistics: () => {
    return axios.get(`${API_BASE_URL}/chats/stats`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Get admin queue
  getAdminQueue: () => {
    return axios.get(`${API_BASE_URL}/admin/chats/queue`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Get chat templates
  getTemplates: () => {
    return axios.get(`${API_BASE_URL}/admin/templates`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Create chat template
  createTemplate: (templateData) => {
    return axios.post(`${API_BASE_URL}/admin/templates`, templateData, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Get analytics overview
  getAnalyticsOverview: () => {
    return axios.get(`${API_BASE_URL}/admin/analytics/overview`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Get performance metrics
  getPerformanceMetrics: () => {
    return axios.get(`${API_BASE_URL}/admin/analytics/performance`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  },

  // Upload file/image
  uploadFile: (file, chatId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);

    return axios.post(`${API_BASE_URL}/chats/upload`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    });
  },
};
