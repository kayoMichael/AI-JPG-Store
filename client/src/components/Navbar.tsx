const NavButton = ({ children }: { children: React.ReactNode }) => (
  <button
    className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
               text-gray-700 bg-white
               transition-colors duration-200 ease-in-out
               hover:bg-purple-100 hover:text-purple-700
               focus:bg-purple-200 focus:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500
               active:bg-purple-300 active:text-purple-900"
  >
    {children}
  </button>
);

import React from 'react';

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="p-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="purple"
            viewBox="0 0 50 50"
          >
            <path d="M47.819 32.652L33.02 6.535C32.133 4.972 30.466 4 28.669 4H20c-.357 0-.687.19-.865.499-.179.31-.18.69-.002.999l23 40C42.312 45.81 42.643 46 43 46c.01 0 .02 0 .029 0 .368-.011.7-.224.865-.553l4.047-8.094C48.688 35.861 48.642 34.104 47.819 32.652zM27.84 28.457l-11-17C16.655 11.172 16.339 11 16 11c-.007 0-.014 0-.021 0-.347.008-.665.194-.841.493l-10 17c-.182.309-.184.692-.006 1.003C5.31 29.808 5.642 30 6 30h21c.366 0 .703-.2.879-.522C28.054 29.156 28.039 28.765 27.84 28.457zM36.874 44.515l-5-9C31.698 35.197 31.363 35 31 35H3c-.354 0-.683.188-.862.493-.18.305-.184.683-.012.992l5 9C7.302 45.803 7.637 46 8 46h28c.354 0 .683-.188.862-.493C37.042 45.202 37.046 44.824 36.874 44.515z"></path>
          </svg>
          <span className="hidden sm:inline-flex">JPG Store</span>
        </a>
        <nav className="flex items-center gap-4 md:gap-6 mr-4">
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-md bg-muted text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary border-2 w-full"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-14 h-14 text-gray-600"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
