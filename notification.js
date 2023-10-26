import admin from 'firebase-admin';

export default async function sendNotification(token, messages) {
  try {
    const payload = {
      notification: {
        title: 'Welcome To Disco Salon...!',
        body: messages,
      },
    };

    const options = {
      priority: 'high',
    };

    const registrationToken = token;
    admin
      .messaging()
      .sendToDevice(registrationToken, payload, options)
      .then(function (response) {
        console.log('Successfully sent message:', response);
      })
      .catch(function (error) {
        console.log('Error sending message:', error);
      });
  } catch (err) {
    console.log(`errlog`, err);
  }
}
