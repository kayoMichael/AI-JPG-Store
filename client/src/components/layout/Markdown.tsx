import React, { useState, FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface MarkDownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MarkDown: FC<MarkDownProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState('edit');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-2">
          <Textarea
            id="description"
            placeholder="Write your description here... 
# Supports Markdown
- Use **bold** for emphasis
- Create lists with `-` or `1.`
- Add links like [this](url)"
            value={value}
            onChange={onChange}
            className="min-h-[200px] font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <Card className="p-4 min-h-[200px] prose prose-sm max-w-none">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">Preview will appear here...</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-500">
        Tip: You can format your text using markdown syntax. Use **bold**, *italic*, lists, and
        more.
      </div>
    </div>
  );
};

export default MarkDown;
