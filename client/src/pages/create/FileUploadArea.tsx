import { ImageIcon, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';

import { FormValues } from './ImageForm';

interface Props {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

const FileUploadArea = ({ register, watch, setValue }: Props) => {
  const file = watch('image');
  const preview = watch('imagePreview');

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
    } else {
      setValue('imagePreview', null, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [file, setValue]);

  return (
    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12 bg-gray-50 relative">
      {preview ? (
        <div className="text-center">
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-4" />
          </div>
          <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">File uploaded successfully</span>
          </div>
          <p className="text-gray-600 text-sm">Click or drag a new file to replace</p>
        </div>
      ) : (
        <div className="text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Drag and drop or click to upload</h3>
          <p className="text-gray-600 mb-2">You may change this after deploying your contract.</p>
          <p className="text-gray-600">
            Recommended size: 350 x 350. File types: JPG, PNG, SVG, or GIF
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
  );
};

export default FileUploadArea;
