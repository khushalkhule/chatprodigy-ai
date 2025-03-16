
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ChatbotForm from '@/components/chatbot/ChatbotForm';

const NewChatbot: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Chatbot</h1>
      <ChatbotForm />
    </div>
  );
};

export default NewChatbot;
