
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Chatbots from './pages/Chatbots';
import NewChatbot from './pages/NewChatbot';
import EditChatbot from './pages/EditChatbot';
import ChatbotSteps from './pages/ChatbotSteps';
import NewStep from './pages/NewStep';
import EditStep from './pages/EditStep';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatbots" element={<Chatbots />} />
          <Route path="/chatbots/new" element={<NewChatbot />} />
          <Route path="/chatbots/edit/:chatbotId" element={<EditChatbot />} />
          <Route path="/chatbots/:chatbotId" element={<ChatbotSteps />} />
          <Route path="/chatbots/:chatbotId/steps/new" element={<NewStep />} />
          <Route path="/chatbots/:chatbotId/steps/edit/:stepId" element={<EditStep />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
