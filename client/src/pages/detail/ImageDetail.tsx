import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, ExternalLink } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const [currentUser, setCurrentUser] = useState<{
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

  const formatText = (text: string) => {
    return text
      ?.replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  };

  const handleLike = async () => {
    if (!user) {
      setOpen(true);
      return;
    }
    const previousLiked = liked;
    const previousLikes = data?.targetImage.likes;

    setLiked(!liked);
    queryClient.setQueryData(
      ['imageDetail', imageId],
      (oldData: { targetImage: { likes: number } }) => ({
        ...oldData,
        targetImage: {
          ...oldData.targetImage,
          likes: liked ? oldData.targetImage.likes - 1 : oldData.targetImage.likes + 1,
        },
      })
    );

    try {
      await axios.post('/likes/register', {
        action: !liked ? 'like' : 'unlike',
        imageId,
      });
    } catch {
      setLiked(previousLiked);
      queryClient.setQueryData(
        ['imageDetail', imageId],
        (oldData: { targetImage: { likes: number } }) => ({
          ...oldData,
          targetImage: {
            ...oldData.targetImage,
            likes: previousLikes,
          },
        })
      );

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
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={data?.targetImage.url}
            fill
            alt="Image"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="space-y-6 aspect-[4/3] lg:aspect-[3/2]">
          <h1 className="text-3xl font-bold">{data?.targetImage.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={!currentUser}
                    className="relative h-12 w-12 rounded-full hover:ring-1 hover:ring-purple-300"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={data?.targetImage.authorId.profileImage || '/default.webp'}
                        alt="user"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="center" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {data?.targetImage.authorId.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {data?.targetImage.authorId.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-4 p-2">
                    {currentUser?.bio && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Bio</p>
                        <ScrollArea className="h-24 w-full rounded-md border">
                          <div className="p-2">
                            <p className="text-sm">{formatText(currentUser?.bio)}</p>
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="text-sm">
                        {currentUser && new Date(currentUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {currentUser?.urls && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Links</p>
                        <div className="space-y-1">
                          {currentUser?.urls.map((link, idx) => (
                            <Link
                              key={idx}
                              to={link.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                            >
                              Bio Link {idx + 1}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
            </div>
          </div>

          <ScrollArea className="h-1/3 md:h-4/5 w-full rounded-md border p-4 ">
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
          <div className="flex justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {findAiModel(parseInt(data?.targetImage.aiModel)).image}
              <span>Generated by {findAiModel(parseInt(data?.targetImage.aiModel)).name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Posted on {new Date(data?.targetImage.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Similar Images</h3>
        <FocusCards cards={data?.similarImages || []} type="category" />
      </div>
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
