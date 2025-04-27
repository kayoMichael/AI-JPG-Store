import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import DetailEdit from './DetailEdit';
import DetailView from './DetailView';

import Image from '@/components/common/Image';
import DetailSkeleton from '@/components/skeleton/DetailSkeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FocusCards } from '@/components/ui/focusCards';
import { useAuth } from '@/context/AuthContext';
import { IImage } from '@/types/image';
import { capitalize } from '@/utils/capitalise';

export default function ImageDetail() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  console.log(editing);
  const [personalConfig, setPersonalConfig] = useState({
    edit: false,
    visibility: 'public',
  });
  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    bio: string;
    createdAt: string;
    urls: { value: string }[];
  }>();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const navigate = useNavigate();
  const { imageId, imageCategory } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['imageDetail', imageId],
    queryFn: async () => {
      const response = await Promise.all([
        axios
          .get(`/images/get?limit=12&&category=${capitalize(imageCategory!)}`)
          .then((res) => res.data),
        axios.get(`/images/get/${imageId}`).then((res) => res.data),
      ]);
      const similarImages = response[0].images.filter(
        (image: { _id: string }) => image._id !== imageId
      );
      const targetImage = response[1];
      const authorId = response[1].authorId._id;
      try {
        const currentUser = await axios.get(`/user/get/${authorId}`).then((res) => res.data._doc);
        setCurrentUser(currentUser);
      } catch {
        setCurrentUser(undefined);
      }
      setLiked(targetImage.liked);
      return { targetImage, similarImages } as {
        targetImage: IImage;
        similarImages: IImage[];
      };
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && data?.targetImage.visibility === 'private' && currentUser?._id !== user?.id) {
      navigate('/');
    } else if (data && currentUser?._id === user?.id) {
      setPersonalConfig({
        edit: true,
        visibility: data.targetImage.visibility,
      });
    } else {
      setPersonalConfig({
        edit: false,
        visibility: 'public',
      });
    }
  }, [user, currentUser, navigate, isLoading, data, imageId]);

  useEffect(() => {
    if (isError) {
      navigate('/error');
    }
  });

  if (isLoading) return <DetailSkeleton />;
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="overflow-hidden rounded-lg w-full">
          <Image
            src={data!.targetImage.url}
            alt="Image"
            className="transition-transform duration-300 hover:scale-105 w-auto object-contain"
          />
        </div>
        <div className="space-y-6 aspect-[4/3] lg:aspect-[3/2]">
          {!editing && <h1 className="text-3xl font-bold">{data?.targetImage.title}</h1>}
          {editing ? (
            <DetailEdit
              image={data!.targetImage}
              setEditing={setEditing}
              personalConfig={personalConfig}
            />
          ) : (
            <DetailView
              setOpen={setOpen}
              imageId={imageId}
              liked={liked}
              setLiked={setLiked}
              currentUser={currentUser}
              personalConfig={personalConfig}
              data={data!}
              setEditing={setEditing}
            />
          )}
        </div>
      </div>
      {!editing && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Similar Images</h3>
          <FocusCards cards={data?.similarImages || []} type="category" />
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Required!</DialogTitle>
            <DialogDescription>
              Please sign in to like images. If you don&apos;t have an account, you can create one
              for free.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link to={'/login'}>
              <Button>Sign In</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
