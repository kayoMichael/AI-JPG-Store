import { Request, Response } from 'express';

import { env } from '../config/env.js';
import { uploadToGCS, getSignedUrl } from '../config/storage.js';
import UserModel, { UpdateUserSchema } from '../models/User.js';
import { excludePassword } from '../utils/password.js';

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(excludePassword(user));
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const data = await UpdateUserSchema.parseAsync(req.body);
    const user = await UserModel.findById(data.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.set(data);
    await user.save();

    res.status(200).json(excludePassword(user));
  } catch (error) {
    console.error('Update user error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUserProfileImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const result = await uploadToGCS({
      fileName,
      fileBuffer: req.file.buffer,
      contentType: req.file.mimetype,
    });
    const userId = req.session.userId;
    const user = await UserModel.findById(userId);

    if (!result.success) {
      res.status(500).json({ error: 'Failed to upload to GCS' });
      return;
    } else if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.set({
      profileImage: `https://storage.googleapis.com/${env.GCS_BUCKET_NAME}/${fileName}`,
    });
    await user.save();

    const signedUrlResult = await getSignedUrl({
      fileName,
      expirationTimeMinutes: 120,
      contentType: req.file.mimetype,
    });

    res.json({
      success: true,
      filePath: result.filePath,
      signedUrl: signedUrlResult.success ? signedUrlResult.url : null,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};
