import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadToCloudinary = (buffer, resourceType = 'image') => {
  console.log(`Starting upload to Cloudinary. Resource type: ${resourceType}`);

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
        timeout: 120000, // 2 minutes timeout for video processing
      }),
    };

    console.log('Upload options:', JSON.stringify(options, null, 2));

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      clearTimeout(uploadTimeout);
      uploadCompleted = true;

      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        console.log('Cloudinary upload success:', {
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          url: result.secure_url,
        });
        resolve(result);
      }
    });

    // Set a timeout for the entire upload process
    uploadTimeout = setTimeout(() => {
      if (!uploadCompleted) {
        console.log('Upload timeout reached, but continuing processing...');
        // Don't reject, let it continue processing
      }
    }, 30000); // 30 second timeout warning

    const readStream = streamifier.createReadStream(buffer);

    readStream
      .on('end', () => {
        console.log('Read stream ended');
        if (!uploadCompleted) {
          console.log('Upload still processing... (This is normal for videos)');
        }
      })
      .on('error', (error) => {
        clearTimeout(uploadTimeout);
        console.error('Read stream error:', error);
        reject(error);
      })
      .pipe(uploadStream)
      .on('error', (error) => {
        clearTimeout(uploadTimeout);
        console.error('Upload stream error:', error);
        reject(error);
      });
  });
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};
