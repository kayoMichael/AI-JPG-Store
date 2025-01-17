import { Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  title: string;

  category: string;

  aiModel: string;

  prompt: string;

  image: File | null;
}

const categories = ['Photography', 'Anime', 'Impressionism', 'Baroque', 'Animal', 'Space'];

const aiModels = ['Stable Diffusion', 'Midjourney', 'DALL-E', 'Sora', 'CLIP', 'VQ-VAE-2', 'Other'];

const CreateImage = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',

    category: '',

    aiModel: '',

    prompt: '',

    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    handleImageFile(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');

      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please upload an image');

      return;
    }

    if (!formData.title || !formData.category || !formData.aiModel || !formData.prompt) {
      toast.error('Please fill in all fields');

      return;
    }

    // Here you would typically send the data to your backend

    console.log('Form submitted:', formData);

    toast.success('Image uploaded successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>

        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter image title"
          maxLength={100}
        />

        <p className="text-sm text-muted-foreground text-right">{formData.title.length}/100</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>

        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aiModel">AI Model</Label>

        <Select
          value={formData.aiModel}
          onValueChange={(value) => handleSelectChange('aiModel', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AI model" />
          </SelectTrigger>

          <SelectContent>
            {aiModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">AI Prompt</Label>

        <Textarea
          id="prompt"
          name="prompt"
          value={formData.prompt}
          onChange={handleInputChange}
          placeholder="Enter the prompt used to generate this image"
          className="min-h-[100px]"
          maxLength={500}
        />

        <p className="text-sm text-muted-foreground text-right">{formData.prompt.length}/500</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted'
        }`}
        onDragOver={(e) => {
          e.preventDefault();

          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleImageDrop}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPreviewUrl('');

                setFormData((prev) => ({ ...prev, image: null }));
              }}
            >
              Remove Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />

            <div>
              <Label
                htmlFor="image-upload"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
              >
                Choose Image
              </Label>

              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <p className="text-sm text-muted-foreground">or drag and drop your image here</p>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        Upload Image
      </Button>
    </form>
  );
};

export default CreateImage;
