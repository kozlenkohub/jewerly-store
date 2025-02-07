import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = async (fileUrl, type = 'auto') => {
  try {
    const options = {
      folder: 'jewelry-store',
      resource_type: type,
    };

    // Для видео добавляем специальные параметры
    if (type === 'video') {
      options.chunk_size = 6000000; // 6MB chunks
      options.eager = [
        { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
        { width: 160, height: 160, crop: 'crop', gravity: 'south', audio_codec: 'none' },
      ];
      options.eager_async = true;
    }

    const result = await cloudinary.uploader.upload(fileUrl, options);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const detectFileType = (mime) => {
  if (mime.startsWith('video/')) return 'video';
  if (mime.includes('webp')) return 'image';
  return 'auto';
};
