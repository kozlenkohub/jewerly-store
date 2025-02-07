import { uploadToCloudinary } from './cloudinaryUpload.js';
import axios from 'axios';

export class TelegramCloudinaryHandler {
  constructor(botToken) {
    this.botToken = botToken;
    this.telegramApiUrl = `https://api.telegram.org/bot${botToken}`;
    this.telegramFileUrl = `https://api.telegram.org/file/bot${botToken}`;
  }

  async uploadFromTelegramToCloudinary(fileId) {
    try {
      // Get file path from Telegram
      const fileData = await this.getTelegramFilePath(fileId);
      if (!fileData?.file_path) {
        throw new Error('Could not get file path from Telegram');
      }

      // Download file from Telegram
      const fileBuffer = await this.downloadTelegramFile(fileData.file_path);
      if (!fileBuffer) {
        throw new Error('Could not download file from Telegram');
      }

      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(fileBuffer);
      return cloudinaryResult;
    } catch (error) {
      console.error('Telegram-Cloudinary upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async getTelegramFilePath(fileId) {
    try {
      const response = await axios.get(`${this.telegramApiUrl}/getFile?file_id=${fileId}`);
      return response.data.result;
    } catch (error) {
      console.error('Get Telegram file path error:', error);
      throw new Error('Failed to get file information from Telegram');
    }
  }

  async downloadTelegramFile(filePath) {
    try {
      const response = await axios.get(`${this.telegramFileUrl}/${filePath}`, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Download Telegram file error:', error);
      throw new Error('Failed to download file from Telegram');
    }
  }
}

// Create singleton instance
const handler = new TelegramCloudinaryHandler(process.env.TELEGRAM_BOT_TOKEN);
export default handler;
