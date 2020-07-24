const FirestoreHandler = require('./dbController')();

module.exports = function notificationController(db, sendNotification) {
  const post = (req, res) => {
    const info = req.body.notification;
    const username = req.body.username;
    return FirestoreHandler.handleUserToken(db, username, pushToken =>
      sendNotification({ ...info, pushToken })
    )
    .then(() => res.status(204).send("ACK"))
    .catch((error) => {
      res.status(500);
      res.send(error.message);
    });
  };

  return { post };
};