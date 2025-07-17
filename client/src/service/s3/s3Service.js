// src/service/s3Service.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { toast } from 'react-toastify';

// S3 Configuration
const S3ClientConfig = {
  region: import.meta.env.VITE_S3_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY || '',
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY || '',
  },
};

// Validate S3 configuration
export const validateS3Config = () => {
  const missing = [];
  if (!import.meta.env.VITE_S3_ACCESS_KEY) missing.push('VITE_S3_ACCESS_KEY');
  if (!import.meta.env.VITE_S3_SECRET_ACCESS_KEY) missing.push('VITE_S3_SECRET_ACCESS_KEY');
  if (!import.meta.env.VITE_S3_BUCKET_NAME) missing.push('VITE_S3_BUCKET_NAME');
  if (!import.meta.env.VITE_S3_REGION) missing.push('VITE_S3_REGION');
  if (missing.length > 0) {
    console.error('Missing S3 configuration:', missing.join(', '));
    toast.error(`Missing AWS configuration: ${missing.join(', ')}`, {
      position: 'top-right',
      autoClose: 5000,
    });
    return false;
  }
  return true;
};

// Upload image to S3
export const uploadFileToS3 = async (file, setIsUploading, setAttachmentUrl) => {
  if (!file) {
    toast.error('No file selected', {
      position: 'top-right',
      autoClose: 3000,
    });
    return null;
  }

  if (!validateS3Config()) {
    return null;
  }

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

  try {
    setIsUploading(true);
    const s3Client = new S3Client(S3ClientConfig);
    const arrayBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `media/${file.name}`,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
      ACL: 'public-read', // Ensure file is publicly accessible
    });

    await s3Client.send(command);
    const url = `https://${bucketName}.s3.${S3ClientConfig.region}.amazonaws.com/media/${file.name}`;
    console.log('S3 Upload URL:', url);
    setAttachmentUrl(url);

    toast.success('File uploaded successfully!', {
      position: 'top-right',
      autoClose: 3000,
      className: 'bg-green-100 text-green-800 border border-green-200',
    });

    return url;
  } catch (err) {
    console.error('Upload error:', err);
    toast.error(`File upload failed: ${err.message}`, {
      position: 'top-right',
      autoClose: 3000,
    });
    return null;
  } finally {
    setIsUploading(false);
  }
};