const express = require('express');
const cors = require('cors');

const sendNotification = require('./expo');
const db = require('./db')();

let observer = db.collection('chats')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'modified') {
        console.log('Change in db: ', change.doc.data());
        const { user1, user2, lastMessage } = change.doc.data();
        if(!lastMessage.read) {
          console.log("Message unread!");

          const sender = lastMessage.user;

          const reciever =
            sender.name === user1.username ? user2.username : user1.username;

          const info = {
            title: 'Mensaje nuevo',
            body: `${sender.name}: ${lastMessage.text}`,
            data: {
              type: 'CHAT_NOTIFICATION',
              user_id: sender._id,
              username: sender.name
            }
          }

          sendNotificationToUser(info, reciever);
        }
        
      }
    });
  });

const sendNotificationToUser = (info, username) => {
  const tokenRef = db.doc(`tokens/${username}`);

  tokenRef.get()
    .then(doc => {
      if (doc.exists) {
        if(!sendNotification({
          ...info,
          pushToken: doc.data().expoToken.data
        })) {
          console.log("Delete push notification token")
          tokenRef.delete()
        }
        return 0;
      } else {
        // doc.data() will be undefined in this case
        console.log("No push notification token");
        return 0;
      }
    })
    .catch(error => {
      console.log("Error getting document:", error);
    });
}


module.exports = function app() {
  const app = express();
  app.use(cors());

  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200);
    res.send('Hi! This is where lives the Notification Server!');
  })

  app.get('/ping', (req, res) => {
    res.status(200);
    res.send('Im alive');
  });

  app.post("/notifications", (req, res) => {
    sendNotificationToUser(req.body.notification, req.body.username);
    res.send(`Send notification`);
  });

  return app;
};