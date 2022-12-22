import { v2 as cloudinary } from "cloudinary";
import { removeUnusedImage } from ".";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryHelper {
  async uploadPhoto(
    imageLocation: string,
    type: "photo" | "verificationDocument"
  ) {
    try {
      const folder = type === "photo" ? "telbam/images" : "telbam/documents";

      const response = await cloudinary.uploader.upload(imageLocation, {
        folder,
        use_filename: true,
      });

      await removeUnusedImage(imageLocation);
      return response.secure_url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteImage(link: string) {
    //
  }
}
