import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '../ui/button';

import { cn } from '@/utils/merge';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function Sidebar({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            location.search === item.href
              ? 'bg-slate-100 text-black hover:bg-slate-100/90'
              : 'bg-white text-black hover:bg-slate-50 hover:underline',
            'w-full justify-start '
          )}
          onClick={() => navigate(item.href)}
        >
          {item.title}
        </Button>
      ))}
    </nav>
  );
}
