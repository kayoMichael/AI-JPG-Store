import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const Error = () => {
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">Error</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>

        <p className="mt-4 text-gray-500">Some Thing Went Wrong...</p>

        <Link to={'/'}>
          <Button asChild>Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
