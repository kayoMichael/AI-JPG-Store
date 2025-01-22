import { Storage } from '@google-cloud/storage';
import multer from 'multer';

import { env } from './env.js';

interface UploadToGCS {
  fileName: string;
  fileBuffer: Buffer;
  contentType?: string;
  directory?: string;
}

interface GetSignedUrlOptions {
  fileName: string;
  expirationTimeMinutes: number;
  contentType?: string;
}

type UrlOptions = {
  version?: 'v4' | 'v2';
  action: 'read' | 'write' | 'delete' | 'resumable';
  expires: number;
  contentType: string;
  responseDisposition: string;
  responseType: string;
};

const serviceAccountKey = JSON.parse(Buffer.from(env.GCS_SERVICE_ACCOUNT, 'base64').toString());

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

async function uploadToGCS({ fileName, fileBuffer, contentType, directory }: UploadToGCS) {
  try {
    const storage = new Storage({
      projectId: env.GCS_PROJECT_ID,
      credentials: serviceAccountKey,
    });

    const bucketName = env.GCS_BUCKET_NAME;

    const bucket = storage.bucket(bucketName);
    const file = directory
      ? bucket.file(`Category/${directory}/${fileName}`)
      : bucket.file(fileName);

    await file.save(fileBuffer, {
      contentType,
      metadata: {
        contentType,
      },
    });

    return {
      success: true,
      filePath: `gs://${bucketName}/${fileName}`,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error,
    };
  }
}

async function getSignedUrl({
  fileName,
  expirationTimeMinutes,
  contentType = 'image/jpeg',
}: GetSignedUrlOptions) {
  try {
    const storage = new Storage({
      projectId: env.GCS_PROJECT_ID,
      credentials: serviceAccountKey,
    });

    const bucket = storage.bucket(env.GCS_BUCKET_NAME);
    const file = bucket.file(fileName);

    const options: UrlOptions = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + expirationTimeMinutes * 120 * 1000,
      contentType,
      responseDisposition: 'inline',
      responseType: contentType,
    };

    const [signedUrl] = await file.getSignedUrl(options);

    return {
      success: true,
      url: signedUrl,
      expiresAt: new Date(options.expires),
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      success: false,
      error,
    };
  }
}

export { uploadToGCS, getSignedUrl, upload };
