
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { User, updateUserProfile } from '@/services/database';
import { toast } from 'sonner';
import { UserIcon } from 'lucide-react';

export const ProfileForm: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
  }>({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">You need to be logged in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await updateUserProfile(user.id, formData);
      if (updatedUser) {
        updateUserData(updatedUser);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <UserIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <CardDescription>
              View and manage your account information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/50">{user.username}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/50">{user.email}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <div className="p-2 border rounded-md bg-muted/50">
                {formatDate(user.created_at)}
              </div>
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2 mt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              type="button" 
              onClick={() => setIsEditing(true)}
              className="mt-6"
            >
              Edit Profile
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
