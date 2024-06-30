"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { todoSchema } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Select from "@/components/select";

const FormSchema = todoSchema
  .pick({ title: true, description: true, doneIn: true })
  .and(
    z.object({ categories: z.array(z.object({ value: z.string(), label: z.string() })).nullable() })
  );
type FormSchemaType = z.infer<typeof FormSchema>;

type props = {
  onSubmit: (data: FormSchemaType) => void;
  categories: {
    value: string;
    label: string;
  }[];
  onCreateOption: (inputValue: string) => void;
  disabled: boolean;
  defaultValues: FormSchemaType;
};

export default function TodoForm({
  onSubmit,
  categories,
  onCreateOption,
  disabled,
  defaultValues,
}: props) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: defaultValues.title,
      description: defaultValues.description,
      doneIn: defaultValues.doneIn,
      categories: defaultValues.categories,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="enter todo title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>categories</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? []}
                  onChange={field.onChange}
                  isLoading={disabled}
                  onCreateOption={onCreateOption}
                  options={categories}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doneIn"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Done in</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  name="description"
                  placeholder="enter todo description..."
                  className="resize-none"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={disabled} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
