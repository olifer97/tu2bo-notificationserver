const express = require("express");
const admin = require('firebase-admin');
const sendNotification = require('./expoService');

const app = express();

const cors = require("cors");

let serviceAccount = require('./tu2bo-131ec-32a6ace4f2e8.json'); //secret ask oli

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

app.use(cors());

const PORT_NUMBER = 3000;

let observer = db.collection('chats')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'modified') {
        console.log('Se cambio la info: ', change.doc.data());
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


app.use(express.json());


app.post("/notifications", (req, res) => {
  sendNotificationToUser(req.body.notification, req.body.username);
  res.send(`Send notification`);
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server Online on Port ${PORT_NUMBER}`);
});