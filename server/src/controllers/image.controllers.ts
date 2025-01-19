import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { uploadToGCS } from '../config/storage.js';
import ImageModel, { RegisterImageSchema, Category } from '../models/Image.js';
import UserModel from '../models/User.js';
import { getEnumValue } from '../utils/enum.js';

import { getLikeCount, getLikeCounts } from './like.controllers.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { title, file, category, aiModel, description, visibility } =
      await RegisterImageSchema.parseAsync(req.body);

    const userId = req.session.userId;
    const user = await UserModel.findById(userId);
    const result = await uploadToGCS({
      fileName: file.filename,
      fileBuffer: file.buffer,
      contentType: file.mimetype,
    });

    const validCategory = getEnumValue(Category, category);

    if (!result.success) {
      res.status(500).json({ error: 'Failed to upload to GCS' });
      return;
    } else if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    } else if (!validCategory) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    await ImageModel.create({
      title,
      category: validCategory,
      aiModel,
      description,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility,
      url: `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${file.filename}`,
    });
    res.status(201).json({ message: 'Image Created Successfully successfully' });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getImagesById = async (req: Request, res: Response) => {
  const { imageId } = req.body;
  try {
    const image = await ImageModel.findById(imageId);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    const likeCount = await getLikeCount(imageId);
    const imageWithLike = { ...image.toObject(), likes: likeCount };
    res.status(200).json(imageWithLike);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllImages = async (req: Request, res: Response) => {
  try {
    const {
      category,
      page = '1',
      limit = '25',
      sortBy = 'createdAt',
      order = 'desc',
      authorId,
    } = req.query;

    if (category) {
      const validCategory = getEnumValue(Category, String(category));
      if (!validCategory) {
        res.status(400).json({ error: 'Invalid category' });
        return;
      }
    }

    if (authorId) {
      if (!mongoose.Types.ObjectId.isValid(String(authorId))) {
        res.status(400).json({ error: 'Invalid authorId format' });
        return;
      }
    }

    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    const sortObject: Record<string, 'asc' | 'desc'> = {};
    if (sortBy === 'lexicographical') {
      sortObject.name = order === 'asc' ? 'asc' : 'desc';
    } else {
      sortObject.createdAt = order === 'asc' ? 'asc' : 'desc';
    }

    const queryObject: Record<string, string> = {};
    if (category) {
      queryObject.category = String(category);
    }
    if (authorId) {
      queryObject.authorId = String(authorId);
    }

    const [images, totalCount] = await Promise.all([
      ImageModel.find(queryObject).sort(sortObject).skip(skip).limit(limitNum).exec(),
      ImageModel.countDocuments(queryObject),
    ]);

    const imageIds = images.map((img) => String(img._id));
    const likeCounts = await getLikeCounts(imageIds);
    const imagesWithLikes = images.map((img) => ({
      ...img.toObject(),
      likes: likeCounts[String(img._id)] || 0,
    }));

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      images: imagesWithLikes,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        category: category || null,
        authorId: authorId || null,
        sortBy,
        order,
      },
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  const { imageId } = req.body;
  try {
    const image = await ImageModel.findByIdAndDelete(imageId);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    } else if (image.authorId !== req.session.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
