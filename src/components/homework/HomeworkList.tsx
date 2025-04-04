import React from 'react';
import { format, isAfter } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface HomeworkListProps {
  homework: any[];
  loading: boolean;
  userRole?: string;
  onSelectHomework?: (homework: any) => void;
}

const HomeworkList: React.FC<HomeworkListProps> = ({ 
  homework, 
  loading,
  userRole = 'student',
  onSelectHomework
}) => {
  const getHomeworkStatusBadge = (dueDate: string, status?: string) => {
    // If there's a status provided (for students), use that
    if (status) {
      switch(status) {
        case 'accepted':
          return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">Accepted</Badge>;
        case 'completed':
          return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">Completed</Badge>;
        case 'pending':
          return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Pending</Badge>;
      }
    }

    // Otherwise fallback to due date logic
    const now = new Date();
    const due = new Date(dueDate);
    
    if (isAfter(now, due)) {
      return <Badge variant="destructive">Past Due</Badge>;
    } else {
      const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 1) {
        return <Badge variant="destructive">Due Today</Badge>;
      } else if (daysUntilDue <= 3) {
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Due Soon</Badge>;
      } else {
        return <Badge variant="outline">Upcoming</Badge>;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (homework.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/10">
        <p>No homework assignments found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {homework.map((hw) => (
        <Card 
          key={hw.homework_id} 
          className={`overflow-hidden ${onSelectHomework ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          onClick={() => onSelectHomework && onSelectHomework(hw)}
        >
          <div className="flex flex-col md:flex-row">
            <div className="bg-primary/10 p-4 flex items-center justify-center md:w-24">
              <Book className="h-10 w-10 text-primary" />
            </div>
            <CardContent className="flex-1 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-lg">{hw.title}</h3>
                {getHomeworkStatusBadge(hw.due_date, hw.status)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Subject: {hw.subject_name} | Teacher: {hw.first_name} {hw.last_name}
              </p>
              <div className="mt-4">
                <p className="text-sm">{hw.description}</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Due: {format(new Date(hw.due_date), "PPP")}</span>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HomeworkList;
