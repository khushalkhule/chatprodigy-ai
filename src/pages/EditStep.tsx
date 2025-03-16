
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StepForm from '@/components/chatbot/StepForm';
import { ChatbotStep, getChatbotSteps } from '@/services/database';

const EditStep: React.FC = () => {
  const { chatbotId, stepId } = useParams<{ chatbotId: string; stepId: string }>();
  const { user, loading } = useAuth();
  const [step, setStep] = useState<ChatbotStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && chatbotId && stepId) {
      loadStep();
    }
  }, [user, chatbotId, stepId]);

  const loadStep = async () => {
    if (!chatbotId || !stepId) return;
    
    setIsLoading(true);
    const steps = await getChatbotSteps(parseInt(chatbotId));
    const foundStep = steps.find(s => s.id === parseInt(stepId)) || null;
    setStep(foundStep);
    setIsLoading(false);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!step) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Step not found</h2>
          <p className="mt-2">The step you're looking for doesn't exist or you don't have permission to edit it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Conversation Step</h1>
      <StepForm step={step} isEditing={true} />
    </div>
  );
};

export default EditStep;
