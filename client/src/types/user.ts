export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bio?: string;
  urls?: { value: string }[];
  favourites?: string[];
}

export interface UpdateUser {
  id: string;
  name?: string;
  email?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bio?: string;
  urls?: { value: string }[];
  favourites?: string[];
}
