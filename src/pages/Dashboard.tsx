
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">AiReplyr</h1>
            <span className="ml-2 text-sm text-muted-foreground">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium">{user.username}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Total Chats</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-lg font-medium">Free Trial</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button variant="default" className="w-full">Upgrade Plan</Button>
                <Button variant="outline" className="w-full">Settings</Button>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-9 h-[calc(100vh-12rem)]">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
