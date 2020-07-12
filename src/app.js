const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./static/swagger.json');
const bodyValidator = require('./middlewares/bodyValidatorMiddleware')();
const sendNotification = require('./expo');

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

  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
      console.log(username)
      FirestoreHandler.handleUserToken(db, username, pushToken =>
        sendNotification({ ...info, pushToken })
      ).then(() => res.status(204));
    }
  );

  return app;
};
