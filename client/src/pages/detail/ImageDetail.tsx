import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import Image from '@/components/common/Image';
import DetailSkeleton from '@/components/skeleton/DetailSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { findAiModel } from '@/constant/AiModels';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { capitalize } from '@/utils/capitalise';

export default function ImageDetail() {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
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
      setLiked(targetImage.liked);
      return { targetImage, similarImages };
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      navigate('/error');
    }
  });

  const handleLike = async () => {
    if (!user) {
      setOpen(true);
      return;
    }
    const previousLiked = liked;
    const previousLikes = data?.targetImage.likes;

    setLiked(!liked);
    queryClient.setQueryData(['imageDetail', imageId], (oldData: any) => ({
      ...oldData,
      targetImage: {
        ...oldData.targetImage,
        likes: liked ? oldData.targetImage.likes - 1 : oldData.targetImage.likes + 1,
      },
    }));

    try {
      await axios.post('/likes/register', {
        action: !liked ? 'like' : 'unlike',
        imageId,
      });
    } catch {
      setLiked(previousLiked);
      queryClient.setQueryData(['imageDetail', imageId], (oldData: any) => ({
        ...oldData,
        targetImage: {
          ...oldData.targetImage,
          likes: previousLikes,
        },
      }));

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update like status. Please try again.',
      });
    }
  };

  if (isLoading) return <DetailSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={data?.targetImage.url}
            fill
            alt="Image"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{data?.targetImage.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={data?.targetImage.authorId.profileImage || '/default.webp'}
                  alt="user"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{data?.targetImage.authorId.name}</h2>
                <Badge variant="secondary">{data?.targetImage.category}</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => handleLike()}>
                {liked ? (
                  <Heart fill="red" strokeWidth={0} className="h-4 w-4" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
              </Button>
              <span className="text-sm font-medium">{data?.targetImage.likes}</span>
              <Button variant="outline" size="icon" disabled>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-1/3 w-full rounded-md border p-4 md:h-2/3">
            <div className="pr-4">
              <ReactMarkdown
                className="prose prose-sm max-w-none text-muted-foreground"
                components={{
                  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
              >
                {data?.targetImage.description || ''}
              </ReactMarkdown>
            </div>
          </ScrollArea>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {findAiModel(parseInt(data?.targetImage.aiModel)).image}
            <span>Generated by {findAiModel(parseInt(data?.targetImage.aiModel)).name}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Similar Images</h3>
        <FocusCards cards={data?.similarImages} type="category" />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Required!</DialogTitle>
            <DialogDescription>
              Please sign in to like or download images. If you don&apos;t have an account, you can
              create one for free.
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
