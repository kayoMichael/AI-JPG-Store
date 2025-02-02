import { Images, Settings, ImagePlus, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { IUser } from '@/types/user';

interface Props {
  user: IUser;
}
const Profile = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 hover:ring-1 hover:ring-purple-400">
            <AvatarImage
              src={user?.profileImage ?? '/default.webp'}
              alt="@Profile"
              loading="eager"
            />
            <AvatarFallback>USER</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={user ? 'w-56' : 'w-28'} align="center" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to={'/create'}>
                <DropdownMenuItem>
                  <ImagePlus />
                  Create Image
                </DropdownMenuItem>
              </Link>
              <Link to={'/account'}>
                <DropdownMenuItem>
                  {' '}
                  <Settings />
                  Account
                </DropdownMenuItem>
              </Link>
              <Link to={`/images/${user._id}/collection`}>
                <DropdownMenuItem>
                  <Images />
                  My Images
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link to={'/signout'}>
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link to={'/login'}>
              <DropdownMenuItem>Sign In</DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
