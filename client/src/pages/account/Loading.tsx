import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">Customize your Portfolio</p>
      </div>

      <Separator />

      <div className="space-y-8">
        {/* Username */}
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Username
          </label>
          <Skeleton className="mt-2 h-10 w-full" />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email
          </label>
          <Skeleton className="h-10 w-full" />
        </div>

        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Bio
          </label>
          <Skeleton className="mt-2 h-20 w-full" />
        </div>

        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            URLs
          </label>
          <Skeleton className="mt-2 h-10 w-full" />
          <Button type="button" variant="outline" size="sm" className="mt-2" disabled>
            Add URL
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button type="button" disabled>
            Update profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Loading;
