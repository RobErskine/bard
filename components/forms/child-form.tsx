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
          .insert([{ ...values, user_id: user.id }]);

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
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthdate</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="your_relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dislikes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dislikes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
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