import React from 'react';

import { cn } from '../../utils/merge';

type InputProps = {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  className?: string;
  value?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<InputProps> = ({
  id,
  label,
  name,
  type,
  placeholder,
  className,
  required,
  autoComplete,
  error,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={cn(
            'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6',
            error ? 'outline-red-500 outline-2' : '',
            className
          )}
          onChange={onChange}
        />
        {error && <p className="text-red-500 text-sm/6 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default InputField;
