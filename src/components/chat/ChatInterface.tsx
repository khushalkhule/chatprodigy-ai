
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, getChatHistory, sendChatMessage } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const history = await getChatHistory(user.id);
    setMessages(history);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;
    
    setIsLoading(true);
    const newMessage = await sendChatMessage(user.id, inputMessage.trim());
    
    if (newMessage) {
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
    } else {
      toast.error("Failed to send message. Please try again.");
    }
    
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p>Please log in to use the chat.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">AiReplyr Chat Assistant</h2>
          <p className="text-muted-foreground text-sm">Ask any question about email responses</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isLoading ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                <div className="flex flex-col">
                  <div className="bg-primary/10 self-end rounded-lg p-3 max-w-[80%]">
                    <p>{msg.message}</p>
                    <span className="text-xs text-muted-foreground block text-right mt-1">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="bg-secondary self-start rounded-lg p-3 max-w-[80%]">
                    <p>{msg.response}</p>
                    <span className="text-xs text-muted-foreground block mt-1">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-pulse">Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              className="self-end"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
