import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import FileUploadArea from './FileUploadArea';

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
import { AiModels } from '@/constant/AiModels';
import { cn } from '@/utils/merge';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(40, 'Title must be less than 40 characters'),
  category: z.string().min(1, 'Category is required'),
  image: z
    .instanceof(FileList, { message: 'Please upload an image' })
    .refine((files) => files.length > 0, {
      message: 'Please upload at least one file',
    })
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .png, .gif, and .svg formats are supported'
    ),
  description: z.string().max(600, 'Description must be less than 600 characters'),
  imagePreview: z.string().nullable(),
  aiModel: z
    .number()
    .min(1, 'AI Model selection is required')
    .refine((model) => model != 100, 'Please select an AI model'),
});

export type FormValues = z.infer<typeof formSchema>;

const categories = [
  'Animal',
  'Anime',
  'Baroque',
  'Contemporary',
  'Impressionism',
  'Photography',
  'Renaissance',
  'Space',
];

const ImageForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      aiModel: 100,
      imagePreview: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setLoading(false);
    console.log(data);
    navigate('/');
  };

  const handleModelSelect = (modelId: number) => {
    setValue('aiModel', modelId, {
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="max-w-3xl space-y-8 mt-10">
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
                  <SelectTrigger className={cn('w-full', errors.category && 'border-red-400')}>
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

        <div className="grid w-full items-center gap-1.5">
          <Label className="text-lg font-semibold">Image</Label>
          <div>
            <label htmlFor="image">
              <FileUploadArea register={register} watch={watch} setValue={setValue} />
            </label>
            {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
          </div>
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

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-lg font-semibold">AI Model</Label>
          </div>
          <Controller
            name="aiModel"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <Card
                  className={cn(
                    'p-6 cursor-pointer border hover:border-purple-400 transition-colors min-w-1/3',
                    field.value === 80 && 'border-purple-400 border-2'
                  )}
                  onClick={() => handleModelSelect(80)}
                >
                  <div className="text-center flex justify-center items-center">
                    <span className="font-semibold text-lg mt-14">Other Model</span>
                  </div>
                </Card>
              </div>
            )}
          />
          {errors.aiModel && <span className="text-red-500 text-sm">{errors.aiModel.message}</span>}
        </div>
        <div className="py-10"></div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 -mr-60">
          <div className="max-w-screen-xl mx-auto flex justify-end">
            <Button type="submit" disabled={isDirty || loading}>
              Create Image
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ImageForm;
