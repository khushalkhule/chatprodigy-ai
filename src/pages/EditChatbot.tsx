
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ChatbotForm from '@/components/chatbot/ChatbotForm';
import { Chatbot, getChatbotById } from '@/services/database';

const EditChatbot: React.FC = () => {
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const { user, loading } = useAuth();
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && chatbotId) {
      loadChatbot();
    }
  }, [user, chatbotId]);

  const loadChatbot = async () => {
    if (!chatbotId) return;
    
    setIsLoading(true);
    const loadedChatbot = await getChatbotById(parseInt(chatbotId));
    setChatbot(loadedChatbot);
    setIsLoading(false);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!chatbot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Chatbot not found</h2>
          <p className="mt-2">The chatbot you're looking for doesn't exist or you don't have permission to edit it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Chatbot</h1>
      <ChatbotForm chatbot={chatbot} isEditing={true} />
    </div>
  );
};

export default EditChatbot;
