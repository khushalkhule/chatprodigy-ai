
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Chatbot, createChatbot, updateChatbot } from '@/services/database';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(1, 'Chatbot name is required'),
  description: z.string().optional(),
  welcome_message: z.string().min(1, 'Welcome message is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ChatbotFormProps {
  chatbot?: Chatbot;
  isEditing?: boolean;
}

const ChatbotForm: React.FC<ChatbotFormProps> = ({ chatbot, isEditing = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: chatbot?.name || '',
      description: chatbot?.description || '',
      welcome_message: chatbot?.welcome_message || 'Hi there! How can I help you today?',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    if (isEditing && chatbot) {
      const updated = await updateChatbot(chatbot.id, values);
      if (updated) {
        navigate('/chatbots');
      }
    } else {
      const newChatbot = await createChatbot(user.id, values);
      if (newChatbot) {
        navigate(`/chatbots/${newChatbot.id}`);
      }
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/chatbots')}>
        <ArrowLeft size={16} className="mr-2" />
        Back to Chatbots
      </Button>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chatbot Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Customer Support Bot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What is this chatbot used for?" 
                    {...field} 
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="welcome_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Welcome Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="The first message visitors will see" 
                    {...field} 
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update Chatbot' : 'Create Chatbot'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatbotForm;
