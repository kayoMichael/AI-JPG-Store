import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UpdateUser } from '@/types/user';
import { cn } from '@/utils/merge';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  bio: z.string().max(160).min(0),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema> & { email: string };

interface Props {
  defaultValues: Partial<ProfileFormValues>;
  userId: string;
}

const ProfileAccount = ({ defaultValues, userId }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: defaultValues.username,
      bio: defaultValues.bio ?? '',
      urls: defaultValues.urls ?? [],
      email: defaultValues?.email || '',
    },
  });
  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  });
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUser) => {
      const response = await axios.patch('/user/update', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });

      const shortenedBio =
        variables.bio && variables.bio.length > 30
          ? variables.bio?.slice(0, 30) + '...'
          : variables.bio;

      toast({
        title: 'Profile Updated Successfully!',
        description: `username: ${variables.name} bio: ${shortenedBio} url: ${variables.urls?.map((url) => url.value).join(', ')}`,
      });
    },
    onError: () => {
      toast({
        title: 'Something Went Wrong...',
        description: 'Please Retry Later.',
      });
    },
  });
  async function onSubmit(data: ProfileFormValues) {
    const updateData: UpdateUser = {
      id: userId,
      name: data.username,
      bio: data.bio,
      urls: data.urls,
    };
    updateProfileMutation.mutate(updateData);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">Customize your Portfolio</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={defaultValues.email} disabled />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Tell us about yourself</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`urls.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && 'sr-only')}>URLs</FormLabel>
                    <FormDescription className={cn(index !== 0 && 'sr-only')}>
                      Add links to your website, blog, or social media profiles.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: '' })}
            >
              Add URL
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending && <Spinner />} Update profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileAccount;
