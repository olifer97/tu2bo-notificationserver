module.exports = function FirestoreHandler() {
  const handleUserToken = (db, username, callback) => {
    const tokenRef = db.doc(`tokens/${username}`);

    return tokenRef
      .get()
      .then(doc => {
        if (doc.exists) {
          if (!callback(doc.data().expoToken.data)) {
            console.log('Delete push notification token');
            tokenRef.delete();
          }
          return 0;
        }
        // doc.data() will be undefined in this case
        console.log('No push notification token');
        return 0;
      })
      .catch(error => {
        console.log('Error getting document:', error);
      });
  };

  const chatObserver = (db, handleNewMessage) =>
    db.collection('chats').onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'modified') {
          console.log('Change in db: ', change.doc.data());
          const { user1, user2, lastMessage } = change.doc.data();
          if (!lastMessage.read) {
            console.log('Message unread!');

            const sender = lastMessage.user;

            const reciever =
              sender.name === user1.username ? user2.username : user1.username;

            handleNewMessage(db, sender, reciever, lastMessage.text);
          }
        }
      });
    });

  return {
    handleUserToken,
    chatObserver
  };
};
