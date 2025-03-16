
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

const API_URL = 'http://localhost:5000/api';

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
