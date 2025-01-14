import Logo from '../common/Logo';
import NavButton from '../common/NavButton';
import Container from '../container/Container';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

const NavbarSkeleton = () => {
  return (
    <header className="border-b">
      <Container className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span>JPG Store</span>
        </a>
        <nav className="flex items-center gap-4 md:gap-6 mr-16">
          <NavButton>Recent</NavButton>
          <NavButton>Most Popular</NavButton>
          <NavButton>Add Image</NavButton>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="md:block absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-md bg-muted text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary border-2 w-full hidden md:inline-flex"
            />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </nav>
      </Container>
    </header>
  );
};

export default NavbarSkeleton;
