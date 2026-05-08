import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ChatProvider, ChatContext } from '../../Context/ChatContext';
import { chatAPI } from '../../Api/chatAPI';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';

const ChatPageContent = () => {
  const { state, setChats, setSelectedChat } = useContext(ChatContext);
  const [isLoading, setIsLoading] = useState(false);

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const response = await chatAPI.getAllChats({
        ...state.filters,
        search: state.searchQuery,
      });
      const chats = response.data?.data?.chats || response.data?.chats || [];
      setChats(chats);
      if (!state.selectedChat && chats.length > 0) {
        setSelectedChat(chats[0]);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-2">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Chat Management</h1>
          <p className="text-sm text-gray-600 mt-2">
            Access your active conversations, support tickets, and chat analytics from one place.
          </p>
        </div>

        <div className="grid h-[calc(100vh-11rem)] min-h-[620px] grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <ChatList
            chats={state.chats}
            selectedChat={state.selectedChat}
            onSelectChat={handleSelectChat}
            isLoading={isLoading}
          />
          <ChatWindow
            chat={state.selectedChat}
            onBack={() => setSelectedChat(null)}
            onRefresh={loadChats}
          />
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => (
  <ChatProvider>
    <ChatPageContent />
  </ChatProvider>
);

export default ChatPage;
