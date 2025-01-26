import { Request, Response } from 'express';

import LikeModel, { RequestLikeSchema } from './../models/Likes.js';

export const getLikeCount = async (imageId: string) => {
  return await LikeModel.countDocuments({ imageId });
};

export const getUserLikeStatus = async (imageId: string, userId: string) => {
  const like = await LikeModel.findOne({ imageId, userId });
  return !!like;
};

export const getLikeCounts = async (imageIds: string[]) => {
  const likeCounts = await LikeModel.aggregate([
    {
      $match: {
        imageId: { $in: imageIds },
      },
    },
    {
      $group: {
        _id: '$imageId',
        likeCount: { $sum: 1 },
      },
    },
  ]);

  return likeCounts.reduce(
    (acc, curr) => {
      acc[curr._id] = curr.likeCount;
      return acc;
    },
    {} as Record<string, number>
  );
};

export const registerLike = async (req: Request, res: Response) => {
  try {
    const { imageId, action } = await RequestLikeSchema.parseAsync(req.body);
    const userId = req.session.userId;
    if (action == 'unlike') {
      const result = await LikeModel.deleteOne({ imageId, userId });
      if (result.deletedCount === 0) {
        res.status(400).json({ error: 'Like does not exist' });
        return;
      }
      res.status(200).json({ message: 'Like removed successfully' });
      return;
    }
    const existingLike = await LikeModel.findOne({ imageId, userId });
    if (existingLike) {
      res.status(400).json({ error: 'Like already exists' });
      return;
    }

    await LikeModel.create({ imageId, userId });

    const likeCount = await getLikeCount(imageId);
    res.status(201).json({
      message: 'Like created successfully',
      likeCount,
    });
  } catch (error) {
    console.error('Error in registerLike:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getLike = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const userId = req.session.userId;

    const like = await LikeModel.findOne({ imageId, userId });
    const likeCount = await getLikeCount(imageId);

    res.status(200).json({
      liked: !!like,
      likeCount,
    });
  } catch (error) {
    console.error('Error in getLike:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserLikes = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const likes = await LikeModel.find({ userId }).populate('imageId').exec();

    res.status(200).json(likes);
  } catch (error) {
    console.error('Error in getUserLikes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
