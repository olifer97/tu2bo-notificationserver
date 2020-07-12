const express = require('express');
const cors = require('cors');

const bodyValidator = require('./middlewares/bodyValidatorMiddleware')();
const sendNotification = require('./expo');
const handleUserToken = require('./controllers/dbController');

const FirestoreHandler = require('./controllers/dbController')();

const handleNewMessage = (db, sender, reciever, text) => {
  const info = {
    title: 'Mensaje nuevo',
    body: `${sender.name}: ${text}`,
    data: {
      type: 'CHAT_NOTIFICATION',
      user_id: sender._id,
      username: sender.name
    }
  };

  FirestoreHandler.handleUserToken(db, reciever, pushToken =>
    sendNotification({ ...info, pushToken })
  );
};

module.exports = function app(db) {
  const app = express();
  FirestoreHandler.chatObserver(db, handleNewMessage);
  app.use(cors());

  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200);
    res.send('Hi! This is where lives the Notification Server!');
  });

  app.get('/ping', (req, res) => {
    res.status(200);
    res.send('Im alive');
  });

  app.post(
    '/notifications',
    bodyValidator.nottificationValidations,
    bodyValidator.validate,
    (req, res) => {
      const info = req.body.notification;
      const username = req.body.username;
      handleUserToken(db, username, token =>
        sendNotification({ ...info, token })
      );
      res.send(`Send notification`);
    }
  );

  return app;
};
