const FirestoreHandler = require('../../src/controllers/dbController')();

let chatMessageNew = {
  user1: { username: 'user1' },
  user2: { username: 'user2' },
  lastMessage: {
    read: false,
    user: { name: 'user1' },
    text: 'message text'
  }
}

let chatRead = {
  lastMessage: {
    read: true,
  }
}

let handleNewMessage;

let collectionRef;
let db;
let querySnapshot;

let changesModified;

describe('chatObserver', () => {
  describe('when new chat arraives', () => {
    beforeEach(() => {
      handleNewMessage = jest.fn().mockReturnThis()
      change = {
        type: 'modified',
        doc: {
          data: jest.fn().mockReturnValue(chatMessageNew)
        }
      } 
      changesModified = [change]
      
      querySnapshot = {
        docChanges: jest.fn().mockReturnValue(changesModified)
      }
      
      collectionRef = {
        onSnapshot: (func) => {
          func(querySnapshot);
        }
      };

      db = {
        collection: jest.fn().mockReturnValue(collectionRef)
      };
    });

    test('should send notification', async () => {
      await FirestoreHandler.chatObserver(db, handleNewMessage);
      expect(handleNewMessage).toHaveBeenCalled();
    });
  });


  describe('when chat is read', () => {
    beforeEach(() => {
      handleNewMessage = jest.fn().mockReturnThis()
      change = {
        type: 'modified',
        doc: {
          data: jest.fn().mockReturnValue(chatRead)
        }
      } 
      changesModified = [change]
      
      querySnapshot = {
        docChanges: jest.fn().mockReturnValue(changesModified)
      }
      
      collectionRef = {
        onSnapshot: (func) => {
          func(querySnapshot);
        }
      };

      db = {
        collection: jest.fn().mockReturnValue(collectionRef)
      };
    });

    test('should send notification', async () => {
      await FirestoreHandler.chatObserver(db, handleNewMessage);
      expect(handleNewMessage).not.toHaveBeenCalled();
    });
  });
});