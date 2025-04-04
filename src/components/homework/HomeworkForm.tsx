
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { DatabaseService } from '@/database/service';

// Homework assignment form schema
const homeworkSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  class_id: z.string().min(1, { message: "Class is required." }),
  section_id: z.string().min(1, { message: "Section is required." }),
  subject_id: z.string().min(1, { message: "Subject is required." }),
  due_date: z.date({ required_error: "Due date is required." }),
});

interface HomeworkFormProps {
  classes: any[];
  sections: any[];
  subjects: any[];
  onSuccess?: () => void;
  user: any;
}

const HomeworkForm: React.FC<HomeworkFormProps> = ({ 
  classes, 
  sections, 
  subjects, 
  onSuccess,
  user 
}) => {
  const homeworkForm = useForm<z.infer<typeof homeworkSchema>>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      title: "",
      description: "",
      class_id: "",
      section_id: "",
      subject_id: "",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date is one week from now
    },
  });

  const onHomeworkClassChange = (value: string) => {
    homeworkForm.setValue("class_id", value);
    homeworkForm.setValue("section_id", "");
    
    // Fetch sections for this class
    const fetchSections = async () => {
      try {
        const fetchedSections = await DatabaseService.classes.getSectionsByClass(Number(value));
        
        // Set first section as default if available
        if (fetchedSections.length > 0) {
          homeworkForm.setValue("section_id", fetchedSections[0].section_id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };
    
    fetchSections();
  };

  const onHomeworkSubmit = async (data: z.infer<typeof homeworkSchema>) => {
    try {
      const result = await DatabaseService.classes.createHomework({
        ...data,
        class_id: Number(data.class_id),
        section_id: Number(data.section_id),
        subject_id: Number(data.subject_id),
        teacher_id: user?.id ? Number(user.id) : 1, // In a real app, this would be the actual teacher ID
        is_active: true,
      });
      
      if (result) {
        toast({
          title: "Success",
          description: "Homework assigned successfully.",
        });
        homeworkForm.reset({
          title: "",
          description: "",
          class_id: data.class_id,
          section_id: data.section_id,
          subject_id: data.subject_id,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Failed to assign homework:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign homework. Please try again.",
      });
    }
  };

  return (
    <Form {...homeworkForm}>
      <form onSubmit={homeworkForm.handleSubmit(onHomeworkSubmit)} className="space-y-4">
        <FormField
          control={homeworkForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Homework Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={homeworkForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide detailed instructions for the homework" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={homeworkForm.control}
            name="class_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select 
                  onValueChange={onHomeworkClassChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                        {cls.class_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={homeworkForm.control}
            name="section_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!homeworkForm.watch("class_id") || sections.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.section_id} value={section.section_id.toString()}>
                        {section.section_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={homeworkForm.control}
            name="subject_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                        {subject.subject_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={homeworkForm.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <div className="space-y-3">
                      <Label>Select due date</Label>
                      <div className="rounded-md border">
                        <input 
                          type="date" 
                          className="w-full p-2" 
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            field.onChange(selectedDate);
                          }}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="flex items-center gap-2"
            disabled={homeworkForm.formState.isSubmitting}
          >
            {homeworkForm.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Broadcast Homework
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HomeworkForm;
