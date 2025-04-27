export interface IImage {
  AuthorPostCount: number;
  __v: number;
  _id: string;
  aiModel: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
  };
  category: string;
  createdAt: string;
  description: string;
  liked: boolean;
  likes: number;
  title: string;
  updatedAt: string;
  url: string;
  visibility: 'public' | 'private';
}
