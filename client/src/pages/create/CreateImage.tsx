import { ArrowLeft } from 'lucide-react';
import { ClipboardList, Eye, EyeOff, Palette, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ImageForm from './ImageForm';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const CreateImage = () => {
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex gap-2 items-center px-4 sm:px-6 lg:px-8 mt-8">
        <Button
          className="rounded-full h-10 w-10 p-2 bg-gray-300"
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </Button>
        <div className="font-sans font-bold">Back To Dashboard</div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  Post Your Own AI Generated Image Here.
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  You&apos;ll need to Create an AI Generated Image first before you can post it
                  here.{' '}
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Generative_artificial_intelligence"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    What is Generative AI?
                  </a>
                </p>
                <ImageForm userId={user!.id} />
              </div>
            </div>

            <div className="lg:w-[450px] xl:w-[500px] hidden lg:block">
              <div className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-8 sticky top-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">
                    After you have made your post, you&apos;ll be able to:
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <ClipboardList className="w-6 h-6 text-gray-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-700">Manage Image settings</h3>
                        <p className="text-gray-600">
                          Delete/Edit/Create new Images Instantaneously
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Sparkles className="w-6 h-6 text-gray-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-700">
                          Increased User Visibility
                        </h3>
                        <p className="text-gray-600">Allows Other Users to View Your Profile</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Palette className="w-6 h-6 text-gray-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-700">Prepare designs</h3>
                        <p className="text-gray-600">Customize your own portfolio with images</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Your community:</h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <EyeOff className="w-6 h-6 text-gray-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-700">Can&apos;t view</h3>
                        <p className="text-gray-600">Your Images unless you make them public.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Eye className="w-6 h-6 text-gray-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-700">Can view</h3>
                        <p className="text-gray-600">The Images set as Public.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateImage;
