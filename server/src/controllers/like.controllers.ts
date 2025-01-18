import { Request, Response } from 'express';

import LikeModel, { RequestLikeSchema } from './../models/Likes.js';
export const registerLike = async (req: Request, res: Response) => {
  try {
    const { imageId } = await RequestLikeSchema.parseAsync(req.body);
    const userId = req.session.userId;
    await LikeModel.create({ imageId, userId });
    res.status(201).json({ message: 'Like Created Successfully successfully' });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  try {
    const { imageId } = await RequestLikeSchema.parseAsync(req.body);
    const userId = req.session.userId;
    await LikeModel.deleteOne({ imageId, userId });
    res.status(201).json({ message: 'Like Deleted Successfully successfully' });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
