import axios from 'axios';
import { ImageIcon, CheckCircle2, Upload, Wand2 } from 'lucide-react';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, UseFormReset } from 'react-hook-form';

import type { FormValues } from './ImageForm';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  reset: UseFormReset<FormValues>;
  setIsAICreated: (value: boolean) => void;
  apiLimit: {
    limit: number | null;
    reset: number | null;
  };
  setApiLimit: React.Dispatch<
    React.SetStateAction<{
      limit: number | null;
      reset: number | null;
    }>
  >;
}

const GenerateImage = ({
  register,
  watch,
  setValue,
  reset,
  setIsAICreated,
  apiLimit,
  setApiLimit,
}: Props) => {
  const file = watch('image');
  const preview = watch('imagePreview');
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (apiLimit.limit === 0) {
      setGenerationError('API limit reached. Please Wait for 24 hours to generate more images.');
    }
  }, [apiLimit]);

  const handlePreview = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('imagePreview', reader.result as string, {
          shouldDirty: false,
          shouldTouch: false,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (file?.[0]) {
      handlePreview(file[0]);
    } else if (activeTab === 'upload' && !preview) {
      setValue('imagePreview', null, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [file, setValue, activeTab, preview]);

  useEffect(() => {
    setIsAICreated(activeTab === 'generate');
  }, [activeTab, setIsAICreated]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      setGenerationError(null);
      const response = await Promise.all([
        axios.post('/images/generate', { prompt }),
        axios.post('/user/limit/decrement'),
      ]);
      const imageData = response[0].data.imageData;
      if (!imageData) {
        setGenerationError('Failed to generate image');
        return;
      }
      try {
        const fetchResponse = await fetch(imageData);
        const blob = await fetchResponse.blob();
        const generatedFile = new File([blob], `generated-${Date.now()}.png`, {
          type: 'image/png',
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(generatedFile);
        setValue('image', dataTransfer.files, {
          shouldDirty: true,
          shouldTouch: true,
        });
      } catch (fileError) {
        setGenerationError(
          `Error creating file from generated image: ${fileError}. Please Try Again.`
        );
      }
      setValue('imagePreview', imageData, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue('aiModel', 1, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setApiLimit((prev) => ({
        ...prev,
        limit: prev.limit ? prev.limit - 1 : 0,
      }));
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger
            value="upload"
            className="flex items-center gap-2"
            disabled={activeTab === 'generate' && preview != null}
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger
            value="generate"
            className="flex items-center gap-2"
            disabled={activeTab === 'upload' && preview != null}
          >
            <Wand2 className="w-4 h-4" />
            Generate Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12 bg-gray-50 relative">
            {preview && activeTab === 'upload' ? (
              <>
                <X
                  className="absolute top-2 right-2 z-10 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue('imagePreview', null, {
                      shouldDirty: false,
                      shouldTouch: false,
                    });
                    const dataTransfer = new DataTransfer();
                    setValue('image', dataTransfer.files, {
                      shouldDirty: false,
                      shouldTouch: false,
                    });
                  }}
                />
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={preview || '/placeholder.svg'}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mb-4"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">File uploaded successfully</span>
                  </div>
                  <p className="text-gray-600 text-sm">Click or drag a new file to replace</p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Drag and drop or click to upload</h3>
                <p className="text-gray-600">
                  Recommended size: 1024 x 1024. File types: JPG, PNG, SVG, or GIF
                </p>
              </div>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/png, image/jpeg, image/gif, image/svg+xml"
              {...register('image')}
            />
          </div>
        </TabsContent>

        <TabsContent value="generate" className="mt-0">
          <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Generate an image with AI</h3>
                <p className="text-gray-600">
                  Describe the image you want to create and a Dall-E 3 Model will generate it for
                  you.
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="A futuristic cityscape at sunset..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button
                  onClick={handleGenerateImage}
                  disabled={
                    isGenerating || !prompt.trim() || preview != null || apiLimit.limit === 0
                  }
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>

              {generationError ? (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  {generationError}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  <span className="text-red-500 font-semibold">Note:</span> You can currently
                  generate <span className="text-red-500 font-semibold">{apiLimit.limit}</span>{' '}
                  images today.
                  <br />
                  Please wait {apiLimit.reset} hours to generate more images.
                </div>
              )}

              {preview && activeTab === 'generate' && (
                <div className="mt-4 text-center">
                  <>
                    <X
                      className="absolute top-50 right-50 z-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue('imagePreview', null, {
                          shouldDirty: false,
                          shouldTouch: false,
                        });
                        const dataTransfer = new DataTransfer();
                        setValue('image', dataTransfer.files, {
                          shouldDirty: false,
                          shouldTouch: false,
                        });
                        reset(
                          { aiModel: undefined },
                          {
                            keepValues: true,
                          }
                        );
                      }}
                    />
                    <div className="relative inline-block">
                      <img
                        src={preview || '/placeholder.svg'}
                        alt="Generated"
                        className="max-w-full h-auto object-contain rounded-lg mb-4"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Image generated successfully</span>
                    </div>
                  </>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GenerateImage;
