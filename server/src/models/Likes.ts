import mongoose from 'mongoose';
import { z } from 'zod';

const { Schema } = mongoose;

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageId: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const RequestLikeSchema = z.object({
  imageId: z.string(),
  action: z.enum(['like', 'unlike']),
});

LikeSchema.index({ imageId: 1, userId: 1 }, { unique: true, background: true });
LikeSchema.index({ userId: 1 }, { background: true });

const LikeModel = mongoose.model('Like', LikeSchema);

export default LikeModel;
