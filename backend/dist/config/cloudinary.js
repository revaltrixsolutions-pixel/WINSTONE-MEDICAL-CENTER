import { v2 as cloudinary } from "cloudinary";
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
const hasCloudinaryConfig = Object.values(cloudinaryConfig).every(Boolean);
if (hasCloudinaryConfig) {
    cloudinary.config(cloudinaryConfig);
}
export function assertCloudinaryConfigured() {
    if (!hasCloudinaryConfig) {
        throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    }
}
export function uploadBuffer(buffer, folder) {
    assertCloudinaryConfigured();
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: "auto",
            use_filename: false,
            unique_filename: true,
        }, (error, result) => {
            if (error || !result?.secure_url || !result.public_id) {
                reject(error ?? new Error("Cloudinary did not return an uploaded file."));
                return;
            }
            resolve({
                secureUrl: result.secure_url,
                publicId: result.public_id,
            });
        });
        stream.end(buffer);
    });
}
export default cloudinary;
