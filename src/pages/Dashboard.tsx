
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CTAButton from '@/components/ui/CTAButton';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Settings, 
  MessageSquare, 
  LogOut, 
  Users, 
  BarChart, 
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  // Dummy chatbot data for demonstration
  const chatbots = [
    {
      id: 'bot-1',
      name: 'Customer Support Bot',
      status: 'active',
      conversations: 1254,
      satisfaction: 92,
    },
    {
      id: 'bot-2',
      name: 'Product Assistant',
      status: 'active',
      conversations: 863,
      satisfaction: 88,
    },
    {
      id: 'bot-3',
      name: 'Lead Generation Bot',
      status: 'paused',
      conversations: 421,
      satisfaction: 76,
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Dashboard Header/Navigation */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-10">
              <a href="/" className="text-2xl font-bold text-primary">
                AiReplyr
              </a>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/dashboard" className="text-foreground/90 font-medium">Dashboard</a>
                <a href="/analytics" className="text-muted-foreground hover:text-foreground">Analytics</a>
                <a href="/integrations" className="text-muted-foreground hover:text-foreground">Integrations</a>
                <a href="/settings" className="text-muted-foreground hover:text-foreground">Settings</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                onClick={() => toast({
                  title: "Settings",
                  description: "Settings page not implemented yet."
                })}
              >
                <Settings size={20} />
              </button>
              <button 
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={20} />
              </button>
              <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Overview */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <CTAButton>
            <Plus size={16} />
            Create New Chatbot
          </CTAButton>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Conversations', value: '2,538', icon: MessageSquare, color: 'bg-blue-500/10 text-blue-500' },
            { label: 'Total Users', value: '1,489', icon: Users, color: 'bg-green-500/10 text-green-500' },
            { label: 'Satisfaction Rate', value: '87%', icon: BarChart, color: 'bg-purple-500/10 text-purple-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chatbots List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Chatbots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((bot) => (
              <div key={bot.id} className="bg-white p-6 rounded-xl border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">{bot.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    bot.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {bot.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span>{bot.conversations} conversations</span>
                  <span>{bot.satisfaction}% satisfaction</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-xs px-3 py-1 border rounded hover:bg-muted/50 transition-colors">
                    Edit
                  </button>
                  <button className="text-xs px-3 py-1 border rounded hover:bg-muted/50 transition-colors">
                    Analytics
                  </button>
                  <button className="text-xs px-3 py-1 border rounded hover:bg-muted/50 transition-colors">
                    Settings
                  </button>
                </div>
              </div>
            ))}
            
            {/* Create new chatbot card */}
            <div 
              className="bg-muted/30 p-6 rounded-xl border border-dashed flex flex-col items-center justify-center text-center h-[182px] hover:bg-muted/50 transition-all cursor-pointer"
              onClick={() => toast({
                title: "Create Chatbot",
                description: "Chatbot creation wizard not implemented yet."
              })}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus size={20} className="text-primary" />
              </div>
              <p className="font-medium">Create New Chatbot</p>
              <p className="text-sm text-muted-foreground mt-1">Build a custom AI assistant</p>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="divide-y">
              {[
                { message: 'Customer Support Bot was updated', time: '2 hours ago', icon: FileText },
                { message: 'Lead Generation Bot was paused', time: '5 hours ago', icon: MessageSquare },
                { message: '34 new conversations today', time: '8 hours ago', icon: MessageSquare },
                { message: 'Knowledge base updated', time: '1 day ago', icon: FileText },
                { message: 'New user feedback received', time: '2 days ago', icon: Users }
              ].map((activity, index) => (
                <div key={index} className="flex items-center px-6 py-4 hover:bg-muted/5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <activity.icon size={16} className="text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
