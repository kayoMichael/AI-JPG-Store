import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import MarkDown from '@/components/layout/Markdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AiModels } from '@/constant/AiModels';
import { IImage } from '@/types/image';
import { cn } from '@/utils/merge';

const categories = [
  'Anime',
  'Baroque',
  'Cyberpunk',
  'Contemporary',
  'Impressionism',
  'Photography',
  'Renaissance',
  'Space',
];

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(40, 'Title must be less than 40 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(2000, 'Description must be less than 600 characters'),
  aiModel: z
    .number()
    .min(1, 'AI Model selection is required')
    .refine((model) => model != 100, 'Please select an AI model'),
});

export type FormValues = z.infer<typeof formSchema>;

interface Props {
  image: IImage;
  personalConfig: {
    edit: boolean;
    visibility: string;
  };
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailEdit = ({ image, setEditing, personalConfig }: Props) => {
  const [visibility, setVisibility] = useState(image.visibility === 'public');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: image.title,
      category: image.category,
      description: image.description,
      aiModel: parseInt(image.aiModel),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('aiModel', String(data.aiModel));
      formData.append('visibility', visibility ? 'public' : 'private');
    } catch {
      setLoading(false);
      navigate('/error');
    }
    setLoading(false);
  };
  const handleModelSelect = (modelId: number) => {
    setValue('aiModel', modelId, {
      shouldValidate: true,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="max-w-3xl space-y-8">
        <div className="flex gap-0.5 items-start">
          <div className="grid w-4/6 items-center gap-1.5">
            <Label className="text-lg font-semibold">Title</Label>
            <Input
              placeholder="Starry Night"
              {...register('title')}
              className={errors.title && 'border-red-400'}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>
          <div className="grid w-2/6 items-center gap-1.5">
            <Label className="text-lg font-semibold">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn('w-full pr-1', errors.category && 'border-red-400')}>
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <span className="text-red-500 text-sm">{errors.category.message}</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Visibility</Label>
          <Switch checked={visibility} onClick={() => setVisibility(!visibility)} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-lg font-semibold">Description</Label>
            </div>
            <span className="text-sm text-gray-600">Markdown supported</span>
          </div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <MarkDown value={field.value} onChange={(e) => field.onChange(e.target.value)} />
            )}
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description.message}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-lg font-semibold">AI Model</Label>
        </div>
        <Controller
          name="aiModel"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {AiModels.map((model) => (
                <Card
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={cn(
                    'p-6 cursor-pointer border hover:border-purple-400 transition-colors min-w-1/3',
                    field.value === model.id && 'border-purple-400 border-2'
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div>{model.image}</div>
                    <span className="font-semibold text-lg">{model.name}</span>
                  </div>
                  <div className="bg-gray-100 inline-block px-3 py-1 rounded-full text-sm mb-4">
                    {model.badge}
                  </div>
                  <p className="text-gray-600">{model.description}</p>
                </Card>
              ))}
            </div>
          )}
        />
      </div>
      <div className="flex items-center">
        <div className="flex-grow flex justify-end">
          {personalConfig.edit && (
            <Button onClick={() => setEditing(false)} disabled={loading}>
              <Save />
              <div>Save</div>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default DetailEdit;
