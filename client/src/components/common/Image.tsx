import React, { useState } from 'react';

export type ImageProps = {
  className?: string;
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  objectFit?: React.CSSProperties['objectFit'];
  objectPosition?: React.CSSProperties['objectPosition'];
  placeholder?: 'blur' | 'empty';
  fill?: boolean;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'>;

const Image = ({
  className = '',
  src,
  width,
  height,
  alt,
  loading = 'lazy',
  decoding = 'async',
  blurDataURL,
  priority = false,
  objectFit,
  objectPosition,
  placeholder = 'empty',
  fill = false,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);

  const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const img = (
    <img
      className={cn(
        'transition duration-300',
        isLoading && placeholder === 'blur' ? 'blur-sm' : 'blur-0',
        fill ? 'absolute h-full w-full left-0 top-0' : '',
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding={decoding}
      style={{
        backgroundImage: isLoading && blurDataURL ? `url(${blurDataURL})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        objectFit,
        objectPosition,
      }}
      alt={alt}
      {...rest}
    />
  );

  if (fill) {
    return <div className="relative w-full h-full">{img}</div>;
  }

  return img;
};

export default Image;
