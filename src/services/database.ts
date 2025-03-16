import { toast } from "sonner";

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

export interface Chatbot {
  id: number;
  user_id: number;
  name: string;
  description: string;
  welcome_message: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotStep {
  id: number;
  chatbot_id: number;
  step_order: number;
  message: string;
  response_type: 'text' | 'options' | 'email' | 'phone' | 'number';
  options?: string[]; // JSON array for options
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  chatbot_id: number;
  visitor_id: string;
  status: 'active' | 'completed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
}

export interface ConversationResponse {
  id: number;
  conversation_id: number;
  step_id: number;
  response: string;
  created_at: string;
}

const API_URL = 'http://localhost:3306/api';

// Auth functions
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Login failed");
      return null;
    }

    const data = await response.json();
    
    // Store token and user data in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed. Please try again.");
    return null;
  }
};

export const registerUser = async (username: string, email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Registration failed");
      return null;
    }

    const data = await response.json();
    toast.success(data.message || "Registration successful! You can now log in.");
    return { id: data.userId, username, email, created_at: new Date().toISOString() };
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Registration failed. Please try again.");
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('currentUser');
  
  if (!token || !userStr) {
    return null;
  }
  
  return JSON.parse(userStr);
};

export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  toast.success("Logged out successfully");
};

export const updateUserProfile = async (userId: number, userData: { username: string; email: string }): Promise<User | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return null;
    }
    
    const response = await fetch(`${API_URL}/auth/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to update profile");
      return null;
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Profile update error:", error);
    toast.error("Failed to update profile");
    return null;
  }
};

// Chat functions
export const getChatHistory = async (userId: number): Promise<ChatMessage[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return [];
    }
    
    const response = await fetch(`${API_URL}/chat/history/${userId}`, {
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to load chat history");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    toast.error("Failed to load chat history");
    return [];
  }
};

export const sendChatMessage = async (userId: number, message: string): Promise<ChatMessage | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return null;
    }
    
    const response = await fetch(`${API_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ userId, message }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to send message");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
    return null;
  }
};

export const clearChatHistory = async (userId: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return false;
    }
    
    const response = await fetch(`${API_URL}/chat/clear/${userId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to clear chat history");
      return false;
    }

    toast.success("Chat history cleared successfully");
    return true;
  } catch (error) {
    console.error("Error clearing chat history:", error);
    toast.error("Failed to clear chat history");
    return false;
  }
};

// Chatbot functions
export const getChatbots = async (userId: number): Promise<Chatbot[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return [];
    }
    
    const response = await fetch(`${API_URL}/chatbot/list/${userId}`, {
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to load chatbots");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching chatbots:", error);
    toast.error("Failed to load chatbots");
    return [];
  }
};

export const getChatbotById = async (chatbotId: number): Promise<Chatbot | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return null;
    }
    
    const response = await fetch(`${API_URL}/chatbot/${chatbotId}`, {
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to load chatbot");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching chatbot:", error);
    toast.error("Failed to load chatbot");
    return null;
  }
};

export const createChatbot = async (userId: number, chatbot: Omit<Chatbot, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Chatbot | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return null;
    }
    
    const response = await fetch(`${API_URL}/chatbot/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ ...chatbot, user_id: userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to create chatbot");
      return null;
    }

    const newChatbot = await response.json();
    toast.success("Chatbot created successfully");
    return newChatbot;
  } catch (error) {
    console.error("Error creating chatbot:", error);
    toast.error("Failed to create chatbot");
    return null;
  }
};

export const updateChatbot = async (chatbotId: number, updates: Partial<Omit<Chatbot, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Chatbot | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return null;
    }
    
    const response = await fetch(`${API_URL}/chatbot/${chatbotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to update chatbot");
      return null;
    }

    const updatedChatbot = await response.json();
    toast.success("Chatbot updated successfully");
    return updatedChatbot;
  } catch (error) {
    console.error("Error updating chatbot:", error);
    toast.error("Failed to update chatbot");
    return null;
  }
};

export const deleteChatbot = async (chatbotId: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return false;
    }
    
    const response = await fetch(`${API_URL}/chatbot/${chatbotId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to delete chatbot");
      return false;
    }

    toast.success("Chatbot deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting chatbot:", error);
    toast.error("Failed to delete chatbot");
    return false;
  }
};

// Chatbot steps functions
export const getChatbotSteps = async (chatbotId: number): Promise<ChatbotStep[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return [];
    }
    
    const response = await fetch(`${API_URL}/chatbot/${chatbotId}/steps`, {
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to load chatbot steps");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching chatbot steps:", error);
    toast.error("Failed to load chatbot steps");
    return [];
  }
};

export const createChatbotStep = async (
  chatbotId: number, 
  step: Omit<ChatbotStep, 'id' | 'chatbot_id' | 'created_at' | 'updated_at'>
): Promise<ChatbotStep | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return null;
    }
    
    const response = await fetch(`${API_URL}/chatbot/${chatbotId}/steps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ ...step, chatbot_id: chatbotId }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to create chatbot step");
      return null;
    }

    const newStep = await response.json();
    return newStep;
  } catch (error) {
    console.error("Error creating chatbot step:", error);
    toast.error("Failed to create chatbot step");
    return null;
  }
};

export const updateChatbotStep = async (
  stepId: number, 
  updates: Partial<Omit<ChatbotStep, 'id' | 'chatbot_id' | 'created_at' | 'updated_at'>>
): Promise<ChatbotStep | null> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return null;
    }
    
    const response = await fetch(`${API_URL}/chatbot/step/${stepId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to update chatbot step");
      return null;
    }

    const updatedStep = await response.json();
    return updatedStep;
  } catch (error) {
    console.error("Error updating chatbot step:", error);
    toast.error("Failed to update chatbot step");
    return null;
  }
};

export const deleteChatbotStep = async (stepId: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required");
      return false;
    }
    
    const response = await fetch(`${API_URL}/chatbot/step/${stepId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to delete chatbot step");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting chatbot step:", error);
    toast.error("Failed to delete chatbot step");
    return false;
  }
};
