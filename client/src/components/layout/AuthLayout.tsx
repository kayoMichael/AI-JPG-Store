import React from 'react';

import useValidate from '@/hooks/use-validate';

interface Props {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: Props) => {
  const { isLoading } = useValidate();

  if (isLoading) return null;
  return <>{children}</>;
};

export default AuthLayout;
