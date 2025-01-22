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
  alt = 'Background of a beautiful view',
  loading = 'lazy',
  decoding = 'async',
  blurDataURL,
  priority = false,
  objectFit = 'cover',
  objectPosition = 'center',
  placeholder = 'empty',
  fill = false,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);

  const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  // Calculate aspect ratio if width and height are provided
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden',
        fill ? 'absolute inset-0' : '',
        className
      )}
      style={{
        aspectRatio: aspectRatio,
      }}
    >
      <img
        className={cn(
          'w-full h-full',
          'transition duration-300',
          isLoading && placeholder === 'blur' ? 'blur-sm' : 'blur-0'
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
    </div>
  );
};

export default Image;
