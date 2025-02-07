import axios from 'axios';
import { uploadToCloudinary } from './cloudinaryUpload.js';

export const detectFileType = (mimeType) => {
  if (mimeType?.startsWith('video/')) return 'video';
  if (mimeType?.includes('webp') || mimeType?.startsWith('image/')) return 'image';
  return 'image';
};

export const uploadMediaToCloudinary = async (fileUrl, fileType = 'image') => {
  try {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const result = await uploadToCloudinary(buffer, fileType);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
