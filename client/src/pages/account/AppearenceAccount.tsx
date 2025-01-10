import React, { useState, useEffect } from 'react';

import Spinner from '@/components/common/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const AppearanceAccount = () => {
  const [preview, setPreview] = useState('https://github.com/shadcn.png');
  const [fileUrl, setFileUrl] = useState<string>();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files ? event.target.files[0] : undefined;
    if (file) {
      setDisabled(false);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setFileUrl(file.name);
    }
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    toast({
      title: 'Profile Image Changed Successfully!',
      description: `Updated Image: ${fileUrl}`,
    });
    setLoading(false);
    setDisabled(true);
  };

  useEffect(() => {
    return () => {
      if (preview && preview !== 'https://github.com/shadcn.png') {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">Change Your Portfolio Image</p>
      </div>
      <Separator />
      <div className="flex flex-col items-center gap-6">
        <Avatar className="h-1/3 w-1/3">
          <AvatarImage src={preview} alt="@Profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 h-1/2">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
            </div>
            <Input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/gif, image/svg+xml"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <Button disabled={disabled} onClick={handleSubmit}>
          {loading && <Spinner />} Save Image
        </Button>
      </div>
    </div>
  );
};

export default AppearanceAccount;
