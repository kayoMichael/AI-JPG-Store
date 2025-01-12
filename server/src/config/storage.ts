import { Storage } from '@google-cloud/storage';

import { env } from './env.js';

interface UploadToGCS {
  fileName: string;
  fileBuffer: Buffer;
  contentType?: string;
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

async function uploadToGCS({ fileName, fileBuffer, contentType }: UploadToGCS) {
  try {
    const storage = new Storage({
      projectId: env.GCS_PROJECT_ID,
      keyFilename: JSON.stringify(serviceAccountKey),
    });

    const bucketName = env.GCS_BUCKET_NAME;

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

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
      keyFilename: JSON.stringify(serviceAccountKey),
    });

    const bucket = storage.bucket(env.GCS_BUCKET_NAME);
    const file = bucket.file(fileName);

    const options: UrlOptions = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + expirationTimeMinutes * 60 * 1000,
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

export { uploadToGCS, getSignedUrl };
