import { CheckCircle, ArrowRight, NotebookPen, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AccountCreated() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Success Message */}
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Account Created Successfully!
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome to AI JPG Store! You&apos;re now a member of our community.
          </p>
        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <NotebookPen className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Share</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Now you can share your own AI Images in the Image Creation Page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Settings className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Take a moment to customize your profile and appearences on the Account Settings
                    Page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-3">
          <Link to="/login">
            <Button className="w-full" size="lg">
              Log In to Your Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
