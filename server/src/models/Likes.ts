import mongoose from 'mongoose';
import { z } from 'zod';

const { Schema } = mongoose;

const LikeSchema = new Schema({
  userId: { type: String, required: true },
  imageId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const RequestLikeSchema = z.object({
  imageId: z.string(),
});

LikeSchema.index({ userId: 1, imageId: 1 }, { unique: true });

const LikeModel = mongoose.model('Like', LikeSchema);

export default LikeModel;
