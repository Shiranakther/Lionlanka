require('dotenv').config();
const { uploadToCloudinary } = require('./middleware/upload');

async function test() {
  try {
    // 1 pixel transparent gif buffer
    const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    const url = await uploadToCloudinary(buffer, 'lionlanka/test');
    console.log('Upload success! URL:', url);
  } catch (err) {
    console.error('Upload failed:', err);
  }
}

test();
