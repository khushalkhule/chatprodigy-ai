
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChatbotStep, createChatbotStep, updateChatbotStep } from '@/services/database';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

const formSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  response_type: z.enum(['text', 'options', 'email', 'phone', 'number']),
  is_required: z.boolean().default(true),
  options: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface StepFormProps {
  step?: ChatbotStep;
  isEditing?: boolean;
}

const StepForm: React.FC<StepFormProps> = ({ step, isEditing = false }) => {
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const navigate = useNavigate();
  const [optionInput, setOptionInput] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: step?.message || '',
      response_type: step?.response_type || 'text',
      is_required: step?.is_required !== undefined ? step.is_required : true,
      options: step?.options || [],
    },
  });

  const responseType = form.watch('response_type');
  const options = form.watch('options') || [];

  const addOption = () => {
    if (!optionInput.trim()) return;
    form.setValue('options', [...options, optionInput.trim()]);
    setOptionInput('');
  };

  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    form.setValue('options', newOptions);
  };

  const onSubmit = async (values: FormValues) => {
    if (!chatbotId) return;
    
    const botId = parseInt(chatbotId);
    
    // Only include options if response type is 'options'
    const formData = {
      ...values,
      options: values.response_type === 'options' ? values.options : undefined,
    };
    
    if (isEditing && step) {
      const updated = await updateChatbotStep(step.id, formData);
      if (updated) {
        navigate(`/chatbots/${chatbotId}`);
      }
    } else {
      const newStep = await createChatbotStep(botId, formData);
      if (newStep) {
        navigate(`/chatbots/${chatbotId}`);
      }
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={() => navigate(`/chatbots/${chatbotId}`)}>
        <ArrowLeft size={16} className="mr-2" />
        Back to Steps
      </Button>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot Message</FormLabel>
                <FormDescription>
                  The message that will be shown to the user at this step
                </FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., What's your name?" 
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
            name="response_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Response Type</FormLabel>
                <FormDescription>
                  The type of response expected from the user
                </FormDescription>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a response type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text (free form)</SelectItem>
                    <SelectItem value="options">Multiple Choice</SelectItem>
                    <SelectItem value="email">Email Address</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {responseType === 'options' && (
            <div className="space-y-4">
              <div>
                <FormLabel>Options</FormLabel>
                <FormDescription>
                  Add options for the user to choose from
                </FormDescription>
                
                <div className="flex space-x-2 mt-2">
                  <Input 
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Enter an option"
                  />
                  <Button 
                    type="button" 
                    onClick={addOption}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              {options.length > 0 ? (
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span>{option}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeOption(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No options added yet</p>
              )}
            </div>
          )}
          
          <FormField
            control={form.control}
            name="is_required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Required</FormLabel>
                  <FormDescription>
                    User must provide a response to continue
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update Step' : 'Add Step'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StepForm;
