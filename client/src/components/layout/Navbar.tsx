import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Container from '../container/Container';

import Logo from './Logo';

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

const Navbar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  return (
    <header className="border-b">
      <Container className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="hidden sm:inline-flex">JPG Store</span>
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
          <div className="relative">
            <button
              id="dropdownUserAvatarButton"
              data-dropdown-toggle="dropdownAvatar"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
              onClick={() => setIsDropDownOpen((prev) => !prev)}
            >
              <span className="sr-only">Open user menu</span>
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
            {isDropDownOpen && (
              <div
                id="dropdownAvatar"
                className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <Link
                  to={'/login'}
                  className="block px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-gray-100"
                  onClick={() => setIsDropDownOpen(false)}
                >
                  <div>Sign Up</div>
                </Link>
                <Link
                  to={'/login'}
                  className="block px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-gray-100"
                  onClick={() => setIsDropDownOpen(false)}
                >
                  <div>Log In</div>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
