
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, getChatHistory, sendChatMessage } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format, isToday, isYesterday } from 'date-fns';

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

  const handleClearConversation = () => {
    if (messages.length === 0) {
      toast.info("No messages to clear");
      return;
    }
    
    if (confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
      setMessages([]);
      toast.success("Conversation cleared");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
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
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">AiReplyr Chat Assistant</h2>
            <p className="text-muted-foreground text-sm">Ask any question about email responses</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearConversation}
            disabled={messages.length === 0}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={16} className="mr-2" />
            Clear
          </Button>
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
                    <span className="text-xs text-muted-foreground block text-right mt-1 flex items-center justify-end">
                      <Clock size={12} className="inline mr-1" />
                      {formatMessageTime(msg.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="bg-secondary self-start rounded-lg p-3 max-w-[80%]">
                    <p>{msg.response}</p>
                    <span className="text-xs text-muted-foreground block mt-1 flex items-center">
                      <Clock size={12} className="inline mr-1" />
                      {formatMessageTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 bg-secondary/20 py-2 px-4 rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '600ms' }}></div>
              </div>
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
