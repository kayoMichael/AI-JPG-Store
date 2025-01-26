import { Request, Response } from 'express';
import mongoose, { PipelineStage } from 'mongoose';

import { env } from '../config/env.js';
import { uploadToGCS } from '../config/storage.js';
import ImageModel, { RegisterImageSchema, Category, IPopulatedImage } from '../models/Image.js';
import UserModel from '../models/User.js';
import { getEnumValue } from '../utils/enum.js';

import { getLikeCount, getLikeCounts, getUserLikeStatus } from './like.controllers.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { title, category, aiModel, description, visibility, image } =
      await RegisterImageSchema.parseAsync({ ...req.body, image: req.file });

    const userId = req.session.userId;
    const user = await UserModel.findById(userId);
    const safeFileName = `${Date.now()}-${image.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const result = await uploadToGCS({
      fileName: safeFileName,
      fileBuffer: image.buffer,
      contentType: image.mimetype,
      directory: category,
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
      url: `https://storage.googleapis.com/${env.GCS_BUCKET_NAME}/Category/${category}/${safeFileName}`,
    });
    res.status(201).json({ message: 'Image Created Successfully successfully' });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getImagesById = async (req: Request, res: Response) => {
  const { imageId } = req.params;
  try {
    const userId = req.session.userId;
    const image = await ImageModel.findById(imageId).populate<IPopulatedImage>({
      path: 'authorId',
      select: 'name email profileImage',
    });
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    let likedStatus = false;
    if (userId) {
      likedStatus = await getUserLikeStatus(imageId, userId);
    }

    const likeCount = await getLikeCount(imageId);
    const userPostCount = await ImageModel.countDocuments({ authorId: image.authorId._id });
    const imageWithLike = {
      ...image.toObject(),
      likes: likeCount,
      AuthorPostCount: userPostCount,
      liked: likedStatus,
    };
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

    const sortObject: Record<string, 1 | -1> = {};
    if (sortBy === 'lexicographical') {
      sortObject.title = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'likes') {
      const pipeline: PipelineStage[] = [
        ...(category
          ? [
              {
                $match: {
                  category: category,
                },
              },
            ]
          : []),
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'imageId',
            pipeline: [{ $count: 'count' }],
            as: 'likesCount',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: '$author' },
        {
          $addFields: {
            likes: {
              $ifNull: [{ $arrayElemAt: ['$likesCount.count', 0] }, 0],
            },
          },
        },
        {
          $project: {
            likesCount: 0,
          },
        },
        {
          $sort: {
            likes: order === 'asc' ? 1 : -1,
            createdAt: -1,
          },
        },
        { $skip: skip },
        { $limit: limitNum },
      ];
      const [images, totalCount] = await Promise.all([
        ImageModel.aggregate(pipeline),
        ImageModel.countDocuments(),
      ]);

      res.status(200).json({
        images,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
          hasPrevPage: pageNum > 1,
        },
        filters: {
          category: category || null,
          authorId: authorId || null,
          sortBy,
          order,
        },
      });
      return;
    } else {
      sortObject.createdAt = order === 'asc' ? 1 : -1;
    }

    const queryObject: Record<string, string> = {};
    if (category) {
      queryObject.category = String(category);
    }
    if (authorId) {
      queryObject.authorId = String(authorId);
    }

    const [images, totalCount] = await Promise.all([
      ImageModel.find(queryObject)
        .populate({
          path: 'authorId',
          select: 'name email profileImage',
        })
        .sort(sortObject)
        .skip(skip)
        .limit(limitNum)
        .exec(),
      ImageModel.countDocuments(queryObject),
    ]);

    const imageIds = images.map((img) => img._id);
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
  const { imageId } = req.params;
  try {
    const image = await ImageModel.findByIdAndDelete(imageId);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    } else if (String(image.authorId) !== req.session.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
