import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary and delete the local file after upload.
 * @param localFilePath - The path to the local file.
 * @returns The Cloudinary upload response or null.
 */
const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Error uploading to Cloudinary:', error.message);
    return null;
  }
};

/**
 * Delete a file from Cloudinary using its public ID.
 * @param publicId - The public ID of the Cloudinary file to delete.
 * @returns The Cloudinary deletion response or null.
 */
const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId);

    return response;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
