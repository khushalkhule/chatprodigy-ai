
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send, X, Minimize2, Maximize2, User } from 'lucide-react';
import CTAButton from '@/components/ui/CTAButton';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const ChatbotDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hi there! 👋 I'm AiReplyr, your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions for quick replies
  const suggestions = [
    'What is AiReplyr?',
    'How does it work?',
    'Pricing options?',
    'How to get started?'
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    const responses: Record<string, string> = {
      'what is aireplyr?': 'AiReplyr is an enterprise-grade SaaS AI chatbot platform designed for seamless website integration. It uses OpenAI's language models to provide conversational AI, offers customizable design, knowledge base management, and supports lead generation.',
      'how does it work?': 'AiReplyr works by integrating with your website through a simple embed code. It uses your custom knowledge base (website content, documents, FAQs) and OpenAI's language models to provide contextually relevant responses to your visitors 24/7.',
      'pricing options?': 'We offer three main plans: Starter at $29/month, Pro at $79/month, and Business at $199/month. Each plan includes different features and usage limits. You can check our pricing section for more details.',
      'how to get started?': 'Getting started is easy! Simply sign up for an account, create your first chatbot using our wizard, configure your knowledge base, customize the design, and add the embed code to your website. The whole process takes less than 30 minutes.'
    };

    setTimeout(() => {
      const normalizedInput = userMessage.toLowerCase();
      let responseText = '';
      
      for (const key in responses) {
        if (normalizedInput.includes(key)) {
          responseText = responses[key];
          break;
        }
      }
      
      if (!responseText) {
        responseText = "Thanks for your message! As this is just a demo, I'm limited in what I can respond to. In a real implementation, I would be able to answer questions based on your website content and knowledge base.";
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        text: responseText,
        timestamp: new Date()
      }]);
      
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: inputValue,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      
      simulateBotResponse(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: suggestion,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    simulateBotResponse(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div id="demo" className="relative z-10">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={cn(
          'fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-white',
          'flex items-center justify-center shadow-lg',
          'transition-all duration-300 hover:scale-105',
          isOpen && 'scale-0 opacity-0'
        )}
        aria-label="Open chat"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Chat widget */}
      <div 
        className={cn(
          'fixed bottom-6 right-6 w-[380px] bg-white rounded-2xl shadow-xl border border-border',
          'flex flex-col transition-all duration-500 transform',
          'overflow-hidden z-50',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
          isMinimized ? 'h-[60px]' : 'h-[600px]'
        )}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">AiReplyr Demo</h3>
              <p className="text-xs text-muted-foreground">Online • Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button
              onClick={toggleChat}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat content */}
        {!isMinimized && (
          <>
            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={cn(
                      'flex',
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                          <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    )}
                    <div 
                      className={cn(
                        'max-w-[75%] p-3 rounded-2xl',
                        message.type === 'user' 
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-muted rounded-tl-none'
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2 mt-1 flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse animation-delay-200"></div>
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick reply suggestions - only show initially */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-muted border-0 rounded-l-md focus:ring-0 focus:outline-none text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className={cn(
                    'p-2 rounded-r-md',
                    inputValue.trim() && !isTyping
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="text-center mt-3">
                <p className="text-xs text-muted-foreground">
                  Powered by <span className="font-medium">AiReplyr</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatbotDemo;
