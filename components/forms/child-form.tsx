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
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { Instruction } from "../ui/instruction";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthdate: z.string().min(1, "Birthdate is required"),
  interests: z.string().optional(),
  dislikes: z.string().optional(),
  your_relationship: z.string().optional(),
});

interface ChildFormProps {
  initialData: {
    name: string;
    birthdate: string;
    interests?: string;
    dislikes?: string;
    your_relationship?: {
      relationship_value: string;
    } | string;
  };
  childId?: string;
  mode?: 'create' | 'edit';
}

interface RelationshipType {
  relationship_value: string;
}

export function ChildForm({ initialData, childId, mode = 'edit' }: ChildFormProps) {
  const router = useRouter();
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelationshipTypes = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_relationship_enum_values");

        if (error) {
          console.error("Error fetching relationship types:", error.message);
          toast.error("Failed to load relationship types");
          return;
        }
        
        setRelationshipTypes(data || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load relationship types");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelationshipTypes();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      birthdate: initialData.birthdate.split('T')[0], // Convert to YYYY-MM-DD
      interests: initialData.interests,
      dislikes: initialData.dislikes,
      your_relationship: typeof initialData.your_relationship === 'string' 
        ? initialData.your_relationship 
        : initialData.your_relationship?.relationship_value
    },
  });

  const childName = form.watch('name');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      if (mode === 'create') {
        const { error } = await supabase
          .from('children')
          .insert([
            { 
              ...values,
              user_id: user.id 
            }
          ]);

        if (error) throw error;
        
        toast.success('Child added successfully');
      } else {
        const response = await fetch(`/api/children/${childId}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update child');
        }

        toast.success('Child updated successfully');
      }

      router.refresh();
      router.push('/account#children');
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormMessage />
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthdate</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <Instruction defaultOpen={false} title="Why do you need a birthdate?">
                <p>We use this birthdate field to calculate this child's age to make sure that the stories that are generated are age appropriate. We may also use this to create a countdown or send reminders when the date gets close.</p>
              </Instruction>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="your_relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormMessage />
              <FormControl>
                <Select {...field} disabled={isLoading}>
                  <option value="">Select a relationship</option>
                  {relationshipTypes.map((type, index) => (
                    <option key={type.relationship_value} value={type.relationship_value}>
                      {type.relationship_value.replace("_", " ")}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Instruction defaultOpen={false} title={`Why do you need my relation to ${childName ? childName : " this child"}?`}>
                <p>If you want to write stories for many children in your life, we use this as a way to keep track of your relationship to each child. In the future we may use this to generate stories that are more specific to your relationship to the child.</p>
              </Instruction>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormMessage />
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <Instruction defaultOpen={false} title={`Why do you need ${childName ? childName + "'s" : " this child's"} interests?`}>
                <p>We use interests to help generate stories that your child will love. The more specific you can be about what they enjoy, the better we can tailor stories to their preferences.</p>
              </Instruction>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dislikes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dislikes</FormLabel>
              <FormMessage />
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <Instruction defaultOpen={false} title={`Why do you need ${childName ? childName + "'s" : " this child's"} dislikes?`}>
                <p>We'll be sure to avoid anything that your child doesn't like.</p>
              </Instruction>
            </FormItem>
          )}
        />
        <button
          type="submit"
          className="bg-black text-white rounded-md px-4 py-2 text-sm"
        >
          Save Changes
        </button>
      </form>
    </Form>
  );
}