import React, { ReactNode } from 'react';

import { cn } from '../../utils/merge';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={cn('p-4', 'mx-10', className)}>{children}</div>;
};

export default Container;
