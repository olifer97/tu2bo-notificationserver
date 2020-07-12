const { Expo } = require('expo-server-sdk');

const expo = new Expo();

module.exports = ({ title, body, data, pushToken }) => {
  const notifications = [];
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return false;
  }

  notifications.push({
    to: pushToken,
    sound: 'default',
    title,
    body,
    data
  });

  const chunks = expo.chunkPushNotifications(notifications);

  (async () => {
    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  })();
  return true;
};
