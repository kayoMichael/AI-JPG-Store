import mongoose from 'mongoose';
import { z } from 'zod';

import { IImageUser } from './User.js';

const { Schema } = mongoose;

export enum Category {
  Impressionism = 'Impressionism',
  Baroque = 'Baroque',
  Anime = 'Anime',
  Photography = 'Photography',
  Cyberpunk = 'Cyberpunk',
  Space = 'Space',
  Renaissance = 'Renaissance',
  Contemporary = 'Contemporary',
}

export enum Visibility {
  Public = 'public',
  Private = 'private',
}

export interface IImage {
  title: string;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
  category: Category;
  aiModel: string;
  description: string;
  authorId: mongoose.Schema.Types.ObjectId;
  visibility: 'public' | 'private';
}

const ImageSchema = new Schema<IImage>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  category: { type: String, enum: Object.values(Category), required: true },
  aiModel: { type: String, required: true },
  description: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'private'], required: true },
});

export interface IPopulatedImage extends Omit<IImage, 'authorId'> {
  authorId: IImageUser;
}

const MulterFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  destination: z.string().optional(),
  path: z.string().optional(),
  buffer: z.instanceof(Buffer),
});

export const RegisterImageSchema = z.object({
  title: z.string(),
  image: MulterFileSchema,
  category: z.nativeEnum(Category),
  aiModel: z.string(),
  description: z.string(),
  visibility: z.nativeEnum(Visibility),
});

export const UpdateImageSchema = z.object({
  imageId: z.string(),
  title: z.string().optional(),
  category: z.nativeEnum(Category).optional(),
  aiModel: z.string().optional(),
  description: z.string().optional(),
  visibility: z.nativeEnum(Visibility).optional(),
});

ImageSchema.index({ category: 1, createdAt: 1 }, { background: true });
ImageSchema.index({ authorId: 1, createdAt: 1 }, { background: true });
ImageSchema.index({ name: 1 }, { background: true });
ImageSchema.index({ authorId: 1 }, { background: true });
ImageSchema.index({ visibility: 1, category: 1 }, { background: true });

const ImageModel = mongoose.model('Image', ImageSchema);

export default ImageModel;
