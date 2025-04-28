import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { AlertCircle, ImagePlus } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import GenerateImage from './GenerateImage';

import Spinner from '@/components/common/Spinner';
import MarkDown from '@/components/layout/Markdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
  description: z.string().max(2000, 'Description must be less than 600 characters'),
  imagePreview: z.string().nullable(),
  aiModel: z
    .number()
    .min(1, 'AI Model selection is required')
    .refine((model) => model != 100, 'Please select an AI model'),
});

export type FormValues = z.infer<typeof formSchema>;

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

const ImageForm = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const [isAICreated, setIsAICreated] = useState(false);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [apiLimit, setApiLimit] = useState<{ limit: number | null; reset: number | null }>({
    limit: null,
    reset: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const response = await axios.get('/user/limit').then((res) => res.data);
        setApiLimit({ limit: response.remainingLimit, reset: response.resetsIn.hours });
      } catch {
        navigate('/error');
      }
    };
    fetchLimit();
  }, [navigate]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
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
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('aiModel', String(data.aiModel));
      formData.append('image', data.image[0]);
      formData.append('visibility', isVisible ? 'public' : 'private');
      await axios.post('/images/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch {
      setLoading(false);
      navigate('/error');
    }
    setLoading(false);
    navigate(`/images/${userId}/collection?toast=create&refetch=true`);
  };

  const handleModelSelect = (modelId: number) => {
    setValue('aiModel', modelId, {
      shouldValidate: true,
    });
  };

  const handleDialogConfirm = async () => {
    const result = await trigger();
    if (!result) {
      setOpen(false);
      return;
    }
    handleSubmit(onSubmit)();
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

        <div className="grid w-full items-center gap-1.5">
          <Label className="text-lg font-semibold">Image</Label>
          <div>
            <GenerateImage
              register={register}
              watch={watch}
              setValue={setValue}
              setIsAICreated={setIsAICreated}
              reset={reset}
              apiLimit={apiLimit}
              setApiLimit={setApiLimit}
            />
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
        {!isAICreated && (
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
                </div>
              )}
            />
            {errors.aiModel && (
              <span className="text-red-500 text-sm">{errors.aiModel.message}</span>
            )}
          </div>
        )}
        <div className="py-10"></div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="flex items-center gap-2 px-4 py-2">
                <ImagePlus className="w-4 h-4" />
                Create Image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <ImagePlus className="w-5 h-5 text-primary" />
                  Image Confirmation
                </DialogTitle>
                <DialogDescription className="pt-2">
                  Are you happy with the image? It cannot be changed after posting unless explicitly
                  deleted. (You can always edit the title, description, and category.)
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 my-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    Please review your image carefully before confirming. This action will make your
                    image available based on your visibility settings.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-muted/40 p-3 rounded-md">
                <Switch
                  id="visibility"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="visibility" className="font-medium">
                  Make image visible to others
                </Label>
              </div>

              <DialogFooter className="flex sm:justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDialogConfirm}
                  type="button"
                  disabled={loading}
                  className={cn('min-w-[120px]', loading ? 'bg-primary/80' : '')}
                >
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2 fill-purple-400" />
                      Creating...
                    </>
                  ) : (
                    'Create Image'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </form>
  );
};

export default ImageForm;
