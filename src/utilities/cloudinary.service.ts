import { v2 as cloudinary } from "cloudinary";
import { removeUnusedImage } from ".";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryHelper {
  async uploadPhoto(
    imageLocation: string,
    type: "photo" | "verificationDocument",
    filename: string
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

  // stream
  async streamUpload(file: Buffer) {
    return new Promise((res, rej) => {
      const cstream = cloudinary.uploader.upload_stream(
        {
          folder: "posters",
          stream: true,
        },
        function (error, result) {
          if (error) return rej(error);
          res(result);
        }
      );

      const str = Readable.from(file);
      str.pipe(cstream);
    });
  }

  async deleteImage(link: string) {
    //
  }
}
