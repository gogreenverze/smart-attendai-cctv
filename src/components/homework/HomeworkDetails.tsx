
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, BookOpen, User, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { DatabaseService } from '@/database/service';

interface HomeworkDetailsProps {
  homework: any;
  userRole: string;
  userId: string;
  onStatusUpdate?: () => void;
  onClose?: () => void;
}

const HomeworkDetails: React.FC<HomeworkDetailsProps> = ({ 
  homework, 
  userRole, 
  userId,
  onStatusUpdate,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState(homework.status || 'pending');
  
  const handleUpdateStatus = async (newStatus: string) => {
    setIsSubmitting(true);
    
    try {
      // Update homework status in database
      await DatabaseService.classes.updateHomeworkStatus({
        homework_id: homework.homework_id,
        student_id: userId,
        status: newStatus,
        comments: comments || null
      });
      
      toast({
        title: "Success",
        description: `Homework marked as ${newStatus}`,
      });
      
      setStatus(newStatus);
      
      // Call the callback to refresh parent component
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Failed to update homework status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update homework status. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{homework.title}</CardTitle>
          {homework.status && (
            <Badge variant="outline" className={`
              ${status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 
                status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : 
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'}
            `}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-2">
          <span className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            Subject: {homework.subject_name}
          </span>
          <span className="flex items-center ml-4">
            <User className="h-4 w-4 mr-1" />
            Teacher: {homework.first_name} {homework.last_name}
          </span>
          <span className="flex items-center ml-4">
            <Calendar className="h-4 w-4 mr-1" />
            Due: {format(new Date(homework.due_date), "PPP")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <h4 className="text-lg font-medium">Description</h4>
          <p>{homework.description}</p>
        </div>
        
        {userRole === 'student' && (
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-2">Your Comments</h4>
            <Textarea 
              placeholder="Add your comments about this homework..." 
              className="min-h-[100px]"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={status === 'completed' || isSubmitting}
            />
          </div>
        )}
        
        {homework.comments && (
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-2">Your Previous Comments</h4>
            <div className="bg-muted/20 p-3 rounded-md">
              <p className="text-sm">{homework.comments}</p>
            </div>
          </div>
        )}

        {homework.submission_date && (
          <div className="mt-6">
            <Separator className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Submitted on: {format(new Date(homework.submission_date), "PPP")}</span>
              <span>Last updated: {format(new Date(homework.updated_at), "PPP")}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      {userRole === 'student' && (
        <CardFooter className="flex justify-between border-t p-4">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
          
          <div className="flex gap-3">
            {status !== 'accepted' && (
              <Button 
                onClick={() => handleUpdateStatus('accepted')} 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Accept
              </Button>
            )}
            {status !== 'completed' && (
              <Button 
                onClick={() => handleUpdateStatus('completed')} 
                disabled={isSubmitting}
                variant={status === 'accepted' ? 'default' : 'secondary'}
                className="flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Mark as Complete
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default HomeworkDetails;
