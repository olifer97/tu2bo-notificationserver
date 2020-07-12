const { Expo } = require("expo-server-sdk");

const expo = new Expo();

module.exports = sendNotification = ({ title, body, data, pushToken }) => {
    let notifications = [];
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return false;
    }
  
    notifications.push({
      to: pushToken,
      sound: "default",
      title,
      body,
      data
    });
  
    let chunks = expo.chunkPushNotifications(notifications);
  
    (async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
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