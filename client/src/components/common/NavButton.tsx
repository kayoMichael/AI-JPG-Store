import { Button } from '../ui/button';

const NavButton = ({ children }: { children: React.ReactNode }) => (
  <Button
    className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
               text-gray-700 bg-white border-none shadow-none
               transition-colors duration-200 ease-in-out
               hover:bg-purple-100 hover:text-purple-700
               focus:bg-purple-200 focus:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500
               active:bg-purple-300 active:text-purple-900"
  >
    {children}
  </Button>
);

export default NavButton;
