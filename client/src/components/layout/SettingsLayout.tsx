import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Sidebar } from '../common/Sidebar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Toaster } from '../ui/toaster';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '?current=profile',
  },
  {
    title: 'Appearence',
    href: '?current=appearance',
  },
  {
    title: 'Security',
    href: '?current=security',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and appearence.</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-lg border-0 shadow-none">
              <X />
            </Button>
          </Link>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <Sidebar items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
