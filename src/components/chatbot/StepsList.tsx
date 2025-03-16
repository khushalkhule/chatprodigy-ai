
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatbotStep, Chatbot, getChatbotById, getChatbotSteps, deleteChatbotStep } from '@/services/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Edit, Trash2, MoveUp, MoveDown, MessageSquare, List } from 'lucide-react';
import { toast } from 'sonner';

const StepsList: React.FC = () => {
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [steps, setSteps] = useState<ChatbotStep[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatbotId) {
      loadChatbotAndSteps();
    }
  }, [chatbotId]);

  const loadChatbotAndSteps = async () => {
    if (!chatbotId) return;
    
    setLoading(true);
    const botId = parseInt(chatbotId);
    
    const [loadedChatbot, loadedSteps] = await Promise.all([
      getChatbotById(botId),
      getChatbotSteps(botId)
    ]);
    
    setChatbot(loadedChatbot);
    setSteps(loadedSteps);
    setLoading(false);
  };

  const handleDeleteStep = async (stepId: number) => {
    if (confirm('Are you sure you want to delete this step? This cannot be undone.')) {
      const success = await deleteChatbotStep(stepId);
      if (success) {
        setSteps(steps.filter(step => step.id !== stepId));
        toast.success("Step deleted successfully");
      }
    }
  };

  const getResponseTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'text': 'Free Text',
      'options': 'Multiple Choice',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'number': 'Number Input'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium">Chatbot not found</h3>
        <p className="text-muted-foreground mt-2">The chatbot you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button className="mt-4" onClick={() => navigate('/chatbots')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Chatbots
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => navigate('/chatbots')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Chatbots
          </Button>
          <h2 className="text-2xl font-bold mt-2">{chatbot.name}</h2>
          <p className="text-muted-foreground">{chatbot.description || "No description"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/chatbots/edit/${chatbotId}`)}>
            <Edit size={16} className="mr-2" />
            Edit Chatbot
          </Button>
          <Button onClick={() => navigate(`/chatbots/${chatbotId}/steps/new`)}>
            <Plus size={16} className="mr-2" />
            Add Step
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-primary" />
          <div>
            <h3 className="font-medium">Welcome Message</h3>
            <p className="text-sm text-muted-foreground">First message visitors will see</p>
          </div>
        </div>
        <Separator className="my-3" />
        <p className="p-2 bg-primary/5 rounded-md">{chatbot.welcome_message}</p>
      </Card>

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <List size={18} />
          Conversation Steps
        </h3>
        
        {steps.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No steps added yet. Create your first conversation step.</p>
            <Button onClick={() => navigate(`/chatbots/${chatbotId}/steps/new`)}>
              <Plus size={16} className="mr-2" />
              Add First Step
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card key={step.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">Step {index + 1}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/chatbots/${chatbotId}/steps/edit/${step.id}`)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteStep(step.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Bot message:</p>
                    <p className="p-2 bg-secondary/20 rounded-md mt-1">{step.message}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      {getResponseTypeLabel(step.response_type)}
                    </div>
                    {step.is_required && (
                      <div className="text-xs px-2 py-1 bg-secondary/20 rounded-full">
                        Required
                      </div>
                    )}
                    {step.response_type === 'options' && step.options && (
                      <div className="text-xs px-2 py-1 bg-secondary/20 rounded-full">
                        {Array.isArray(step.options) ? `${step.options.length} options` : '0 options'}
                      </div>
                    )}
                  </div>
                  
                  {step.response_type === 'options' && step.options && Array.isArray(step.options) && step.options.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Options:</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {step.options.map((option, i) => (
                          <div key={i} className="p-2 bg-muted rounded-md text-sm">
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepsList;
