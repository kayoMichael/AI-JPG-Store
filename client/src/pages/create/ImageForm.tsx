import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import MarkDown from '@/components/layout/Markdown';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AiModels } from '@/constant/AiModels';
import { cn } from '@/utils/merge';

const formSchema = z.object({
  title: z.string().min(1).max(20),
  description: z.string().min(1).max(300),
  image: z.string(),
  aiModel: z.string(),
  category: z.string(),
});

const ImageForm = () => {
  const [selectedModel, setSelectedModel] = useState<number>(100);
  const [description, setDescription] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const data = formSchema.safeParse(event.target);
    if (!data.success) {
      return;
    }
    console.log(data.data);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="max-w-3xl space-y-8 mt-10">
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-lg font-semibold">Title</Label>
          <Input placeholder="Starry Night" />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-lg font-semibold">Image</Label>
          <div>
            <Input
              id="image"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/gif, image/svg+xml"
            />
            <div className="border rounded-lg transition-colors hover:border-purple-400 p-6">
              <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12 bg-gray-50">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Drag and drop or click to upload</h3>
                  <p className="text-gray-600 mb-2">
                    You may change this after deploying your contract.
                  </p>
                  <p className="text-gray-600">
                    Recommended size: 350 x 350. File types: JPG, PNG, SVG, or GIF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-lg font-semibold">Description</Label>
            </div>
            <span className="text-sm text-gray-600">Markdown supported</span>
          </div>
          <MarkDown value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-lg font-semibold">AI Model</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AiModels.map((model) => (
              <Card
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={cn(
                  'p-6 cursor-pointer border hover:border-purple-400 transition-colors min-w-1/3',
                  selectedModel === model.id && 'border-purple-400 border-2'
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
                selectedModel === 80 && 'border-purple-400 border-2'
              )}
              onClick={() => setSelectedModel(80)}
            >
              <div className="text-center flex justify-center items-center">
                <span className="font-semibold text-lg mt-14">Other Model</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ImageForm;
