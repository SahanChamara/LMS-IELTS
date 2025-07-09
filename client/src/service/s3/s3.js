import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

export class AwsS3Service {
  constructor() {
    this.s3Client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: "lmsfeedbucket",
        Key: file.name,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
      });

      await this.s3Client.send(command);

      // Return uploaded file URL
      return `https://mosburger.s3.eu-north-1.amazonaws.com/${file.name}`;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }
}
