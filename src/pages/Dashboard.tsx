
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart4, Settings, ArrowUpRight, Bell, User, Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            <div className="text-sm text-right flex items-center gap-2">
              <Link to="/profile" className="hover:underline flex items-center">
                <User size={18} className="mr-1" />
                <span className="font-medium">{user.username}</span>
              </Link>
            </div>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Account Overview</h2>
                <Button variant="ghost" size="icon">
                  <Settings size={18} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/5 rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Total Chats</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="bg-primary/5 rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">Free Trial</p>
                    <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                      Upgrade <ArrowUpRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-md font-medium mb-3">Quick Stats</h3>
              <Separator className="my-2" />
              
              <div className="space-y-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Messages</span>
                  <span className="font-medium">24/50</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '48%' }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">Storage</span>
                  <span className="font-medium">12.5MB/100MB</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '12.5%' }}></div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button variant="default" className="w-full">
                  <BarChart4 size={16} className="mr-2" />
                  View Analytics
                </Button>
                <Link to="/chatbots">
                  <Button variant="default" className="w-full">
                    <Bot size={16} className="mr-2" />
                    Manage Chatbots
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="w-full">
                    <User size={16} className="mr-2" />
                    Profile Settings
                  </Button>
                </Link>
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
