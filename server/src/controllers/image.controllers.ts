import { Request, Response } from 'express';

import { uploadToGCS } from '../config/storage.js';
import ImageModel, { RegisterImageSchema, Category } from '../models/Image.js';
import UserModel from '../models/User.js';
import { getEnumValue } from '../utils/enum.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { title, file, category, aiModel, prompt, description } =
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
      prompt,
      description,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    res.status(200).json(image);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllImages = async (req: Request, res: Response) => {
  const { category } = req.query;
  try {
    if (category) {
      const validCategory = getEnumValue(Category, String(category));
      if (!validCategory) {
        res.status(400).json({ error: 'Invalid category' });
        return;
      }
    }
    const images = await ImageModel.find({ category: category || { $exists: true } });

    res.status(200).json(images);
  } catch {
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
