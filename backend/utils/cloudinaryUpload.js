import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadToCloudinary = (buffer, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    let uploadCompleted = false;
    let uploadTimeout;

    const options = {
      resource_type: resourceType,
      folder: 'jewerly-store',
      ...(resourceType === 'video' && {
        format: 'mp4',
        transformation: [
          {
            width: 1000,
            height: 1000,
            crop: 'fill',
            quality: 'auto',
          },
        ],
        bit_rate: '1m',
        audio_codec: 'none',
        chunk_size: 20000000,
        timeout: 120000,
      }),
    };

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      clearTimeout(uploadTimeout);
      uploadCompleted = true;
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

    uploadTimeout = setTimeout(() => {
      if (!uploadCompleted) {
        // Continue processing
      }
    }, 30000);

    const readStream = streamifier.createReadStream(buffer);

    readStream
      .on('end', () => {
        // Stream ended
      })
      .on('error', (error) => {
        clearTimeout(uploadTimeout);
        reject(error);
      })
      .pipe(uploadStream)
      .on('error', (error) => {
        clearTimeout(uploadTimeout);
        reject(error);
      });
  });
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    throw error;
  }
};
