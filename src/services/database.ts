
import { toast } from "sonner";

// MySQL Connection details
const DB_CONFIG = {
  host: '82.180.143.240',
  database: 'u264210823_aireplyrdb',
  user: 'u264210823_aireplyrdbuser',
  password: 'E9!ui0xjt@Z9',
  port: 3306
};

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Don't expose this in responses
  created_at: string;
}

export interface ChatMessage {
  id: number;
  user_id: number;
  message: string;
  response: string;
  created_at: string;
}

// Since we can't directly access MySQL from the browser, 
// we'll create placeholder functions that will later be 
// replaced with actual API calls to a backend server

// Auth functions
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    // In a real implementation, this would make a fetch call to your backend
    console.log(`Attempting login for user: ${email}`);
    
    // Simulate successful login for demo purposes
    if (email && password) {
      const mockUser: User = {
        id: 1,
        username: email.split('@')[0],
        email: email,
        created_at: new Date().toISOString()
      };
      
      // Store in localStorage for persistence (not secure, just for demo)
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      toast.success("Logged in successfully");
      return mockUser;
    }
    
    toast.error("Invalid credentials");
    return null;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed. Please try again.");
    return null;
  }
};

export const registerUser = async (username: string, email: string, password: string): Promise<User | null> => {
  try {
    console.log(`Registering user: ${username}, ${email}`);
    
    // Simulate successful registration
    const mockUser: User = {
      id: 1,
      username,
      email,
      created_at: new Date().toISOString()
    };
    
    toast.success("Registration successful! You can now log in.");
    return mockUser;
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Registration failed. Please try again.");
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('currentUser');
  toast.success("Logged out successfully");
};

// Chat functions
export const getChatHistory = async (userId: number): Promise<ChatMessage[]> => {
  try {
    console.log(`Fetching chat history for user: ${userId}`);
    
    // Return mock data for now
    const mockHistory: ChatMessage[] = [
      {
        id: 1,
        user_id: userId,
        message: "Hello, how does this work?",
        response: "Hi there! I'm your AI assistant. I can help answer questions and provide support for your business.",
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 2,
        user_id: userId,
        message: "Can you help me respond to customer emails?",
        response: "Absolutely! I can help draft responses to customer inquiries, handle common questions, and help you maintain a consistent tone across all communications.",
        created_at: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
      },
      {
        id: 3,
        user_id: userId,
        message: "How do I customize your responses?",
        response: "You can train me by providing examples of your preferred response style and tone. The more we interact, the better I'll understand your preferences and business needs.",
        created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      }
    ];
    
    return mockHistory;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    toast.error("Failed to load chat history");
    return [];
  }
};

export const sendChatMessage = async (userId: number, message: string): Promise<ChatMessage | null> => {
  try {
    console.log(`Sending message for user ${userId}: ${message}`);
    
    // Mock AI response generation
    const responses = [
      "I understand your question. Based on the information provided, I'd recommend focusing on improving your customer engagement strategy.",
      "That's a great point. Let me suggest a few approaches that have worked well for similar businesses.",
      "I can help with that! Here's a step-by-step process you might want to follow.",
      "Thanks for sharing that information. Have you considered looking at this from a different perspective?",
      "I see what you're trying to accomplish. Let me provide some insights that might be useful for your specific case."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Create mock chat message object
    const newMessage: ChatMessage = {
      id: Math.floor(Math.random() * 1000),
      user_id: userId,
      message,
      response: randomResponse,
      created_at: new Date().toISOString()
    };
    
    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
    return null;
  }
};
