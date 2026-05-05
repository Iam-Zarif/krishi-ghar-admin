import { createContext, useCallback, useReducer } from 'react';

export const ChatContext = createContext();

const initialState = {
  chats: [],
  selectedChat: null,
  messages: [],
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    userType: 'all',
  },
  searchQuery: '',
  loading: false,
  error: null,
  statistics: {
    totalActive: 0,
    byStatus: {},
    averageResponseTime: 0,
    unresolved: 0,
    todayVolume: 0,
  },
  admin: null,
  notifications: [],
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload, loading: false };
    case 'SET_SELECTED_CHAT':
      return { ...state, selectedChat: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    case 'SET_ADMIN':
      return { ...state, admin: action.payload };
    case 'UPDATE_CHAT_STATUS':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === action.chatId ? { ...chat, status: action.status } : chat
        ),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notif) => notif.id !== action.id
        ),
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        searchQuery: '',
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setChats = useCallback((chats) => {
    dispatch({ type: 'SET_CHATS', payload: chats });
  }, []);

  const setSelectedChat = useCallback((chat) => {
    dispatch({ type: 'SET_SELECTED_CHAT', payload: chat });
  }, []);

  const setMessages = useCallback((messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  }, []);

  const addMessage = useCallback((message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  const setFilter = useCallback((key, value) => {
    dispatch({ type: 'SET_FILTER', key, value });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setStatistics = useCallback((stats) => {
    dispatch({ type: 'SET_STATISTICS', payload: stats });
  }, []);

  const setAdmin = useCallback((admin) => {
    dispatch({ type: 'SET_ADMIN', payload: admin });
  }, []);

  const updateChatStatus = useCallback((chatId, status) => {
    dispatch({ type: 'UPDATE_CHAT_STATUS', chatId, status });
  }, []);

  const addNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', id });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const value = {
    state,
    setChats,
    setSelectedChat,
    setMessages,
    addMessage,
    setFilter,
    setSearchQuery,
    setLoading,
    setError,
    setStatistics,
    setAdmin,
    updateChatStatus,
    addNotification,
    removeNotification,
    resetFilters,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
