import { Storage } from '@google-cloud/storage';

export async function uploadImageToStorage(fileName, base64Image, callback) {
  try {
    const storage = new Storage({
      keyFilename: './saloonapp.json',
    });
    const bucketName = "kharphi-image";
    const bucket = storage.bucket(bucketName);
    const fileContent = Buffer.from(base64Image, 'base64');
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Error uploading image:', error);
        reject('Error uploading image');
      });

      stream.on('finish', () => {
        // Make the file public
        // file.makePublic((error) => {
        //   if (error) {
        //     console.error('Error making file public:', error);
        //     reject('Error making file public');
        //   } else {
        //     const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        //     resolve(publicUrl);
        //   }
        // });

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        return publicUrl;
      });

      stream.end(fileContent);
    });
  } catch (error) {
    console.error('Error:', error);
    throw new Error('An error occurred during image upload');
  }
}
