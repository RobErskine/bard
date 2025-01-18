"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { Instruction } from "../ui/instruction";
import { LoadingIndicator } from "../ui/loading-indicator";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  prompt: z.string().min(1, "Prompt is required"),
  theme: z.string().min(1, "Theme is required"),
  reading_time_minutes: z.string().min(1, "Reading time is required"),
  story_structure: z.string().min(1, "Story structure is required"),
});

const readingTimeOptions = [
  { value: "5", label: "5 minutes" },
  { value: "10", label: "10 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "20", label: "20 minutes" },
  { value: "20+", label: "20+ minutes" },
];

interface StoryStructureType {
  story_structure_value: string;
}

interface StoryFormProps {
  initialData?: {
    title: string;
    prompt: string;
    theme: string;
    reading_time_minutes: string;
    story_structure: string;
  };
  storyId?: string;
  mode?: 'create' | 'edit';
}

export function StoryForm({ initialData, storyId, mode = 'create' }: StoryFormProps) {
  const router = useRouter();
  const [storyStructures, setStoryStructures] = useState<StoryStructureType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoryStructures = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_story_structure_enum_values");

        if (error) {
          console.error("Error fetching story structures:", error.message);
          toast.error("Failed to load story structures");
          return;
        }
        
        setStoryStructures(data || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load story structures");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryStructures();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      prompt: "",
      theme: "",
      reading_time_minutes: "",
      story_structure: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      if (mode === 'create') {
        const { error } = await supabase
          .from('stories')
          .insert([
            {
              ...values,
              user_id: user.id,
            },
          ]);

        if (error) throw error;
        toast.success('Story created successfully');
      } else {
        const { error } = await supabase
          .from('stories')
          .update(values)
          .eq('id', storyId);

        if (error) throw error;
        toast.success('Story updated successfully');
      }

      router.refresh();
      router.push('/account#stories');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save story');
    }
  };

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter story title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormMessage />
              <FormControl>
                <Textarea 
                  placeholder="Enter story prompt" 
                  className="min-h-[100px] rounded-b-none"
                  {...field} 
                />
              </FormControl>
              <Instruction defaultOpen={true} title="What is a prompt?">
                <p>Think of this Prompt as a starter for your story. Should include the characters, setting, theme, conflict, etc for what you want Lil' Bardy to write.</p>
              </Instruction>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormMessage />
              <FormControl>
                <Input placeholder="Enter story theme" className="rounded-b-none" {...field} />
              </FormControl>
              <Instruction defaultOpen={true} title="What is a theme?">
                <p>You can think of the Theme as a "moral of the story". It could be about sharing, kindness, eating your veggies, the importance of telling the truth, etc.</p>
              </Instruction>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reading_time_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading Time</FormLabel>
              <FormMessage />
              <FormControl>
                <Select {...field} disabled={isLoading} className="rounded-b-none">
                  <option value="">Select reading time</option>
                  {readingTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Instruction defaultOpen={true} title="What does reading time do?">
                <p>Specifying the reading time will indicate how long your generated story should be. This takes into account reading, voices, pauses, etc.</p>
              </Instruction>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="story_structure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Structure</FormLabel>
              <FormMessage />
              <FormControl>
                <Select {...field} disabled={isLoading}>
                  <option value="">Select story structure</option>
                  {storyStructures.map((type) => (
                    <option key={type.story_structure_value} value={type.story_structure_value}>
                      {type.story_structure_value.replace('_', ' ')}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Instruction defaultOpen={true} title="What is a prompt?">
                <p className="mb-2">Story structure shapes how your generated story will flow:</p>
                <ul className="list-disc pl-4">
                  <li className="mb-2"><strong>Traditional (Three-Act)</strong>: A linear narrative divided into setup, confrontation, and resolution, where a protagonist faces and ultimately overcomes a central conflict.</li>
                  <li className="mb-2"><strong>Five-Act</strong>: A dramatic structure popularized by Shakespeare that follows exposition, rising action, climax, falling action, and denouement, allowing for more complex plot development and multiple turning points.</li>
                  <li className="mb-2"><strong>Seven-Point</strong>: A story framework that progresses through hook, plot turn 1, pinch point 1, midpoint, pinch point 2, plot turn 2, and resolution, creating a detailed roadmap for character development and plot progression.</li>
                  <li><strong>Kishotenketsu</strong>: A four-part East Asian narrative structure consisting of introduction (ki), development (sho), twist (ten), and conclusion (ketsu) that doesn't rely on conflict but rather on contrast and revelation.</li>
                </ul>
              </Instruction>
            </FormItem>
          )}
        />

        <Button type="submit">
          {mode === 'create' ? 'Create Story' : 'Update Story'}
        </Button>
      </form>
    </Form>
  );
}
