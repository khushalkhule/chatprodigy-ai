
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chatbot, getChatbots, deleteChatbot } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const ChatbotList: React.FC = () => {
  const { user } = useAuth();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadChatbots();
    }
  }, [user]);

  const loadChatbots = async () => {
    if (!user) return;
    
    setLoading(true);
    const botList = await getChatbots(user.id);
    setChatbots(botList);
    setLoading(false);
  };

  const handleDelete = async (chatbotId: number) => {
    if (confirm('Are you sure you want to delete this chatbot? This cannot be undone.')) {
      const success = await deleteChatbot(chatbotId);
      if (success) {
        setChatbots(chatbots.filter(bot => bot.id !== chatbotId));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Chatbots</h2>
        <Button onClick={() => navigate('/chatbots/new')}>
          <Plus size={16} className="mr-2" />
          Create New Chatbot
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : chatbots.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <MessageSquare size={48} className="text-muted-foreground" />
            <h3 className="text-xl font-medium">No chatbots yet</h3>
            <p className="text-muted-foreground">Create your first chatbot to start collecting leads and assisting customers.</p>
            <Button onClick={() => navigate('/chatbots/new')}>
              <Plus size={16} className="mr-2" />
              Create Your First Chatbot
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatbots.map(bot => (
            <Card key={bot.id} className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{bot.name}</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/chatbots/edit/${bot.id}`)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(bot.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{bot.description || "No description"}</p>
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => navigate(`/chatbots/${bot.id}`)}>
                  <MessageSquare size={16} className="mr-2" />
                  Manage Steps
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatbotList;
