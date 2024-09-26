import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: "faisalraza",
    api_key: "615757737347819",
    api_secret: "YGm49A7doHVOqM0YYL-P2lgkcDI",
});

export const fileUploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;
        const uploadFile = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });

        fs.unlinkSync(filePath)
        return uploadFile;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        fs.unlinkSync(filePath)
    }
};
