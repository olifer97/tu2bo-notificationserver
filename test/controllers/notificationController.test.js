const notificationControllerFactory = require('../../src/controllers/notificationController');

let expoToken = {
  data: 'ExponentPushToken[TEST]'
}

let body = {
  username: 'aUsername',
  notification: {
    type: 'NOTIFICATION_TYPE'
  }
}

let tokenRef;
let db;
let sendNotification;
let sendNotificationNotCalled;

let req;
let res;

beforeEach(() => {
  req = {
    body: {},
    params: {},
    query: {}
  };
  res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn()
  };

  sendNotification = jest.fn().mockReturnValue(true)

  sendNotificationNotCalled = jest.fn().mockReturnThis()
});

describe('get', () => {
  describe('when raise error', () => {
    beforeEach(() => {  
  
        tokenRef = {
          get: jest.fn().mockRejectedValue(new Error('DB Error'))
        };
        db = {
          doc: jest.fn().mockReturnValue(tokenRef)
        };
  
        notificationController = notificationControllerFactory(db, sendNotificationNotCalled);
        req.body = body; 
      });
  
      test('should respond with success', async () => {
        await notificationController.post(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(sendNotificationNotCalled).not.toHaveBeenCalled();
      });
  });

  describe('when token found', () => {
    beforeEach(() => {  
      doc = {
        exists: true,
        data: jest.fn().mockReturnValue({ expoToken })
      }

      tokenRef = {
        get: jest.fn().mockResolvedValue(doc)
      };
      db = {
        doc: jest.fn().mockReturnValue(tokenRef)
      };

      notificationController = notificationControllerFactory(db, sendNotification);
      req.body = body; 
    });

    test('should respond with success', async () => {
      await notificationController.post(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(sendNotification).toHaveBeenCalled();
    });
  });


  describe('when token not found', () => {
    beforeEach(() => {  
      doc = {
        exists: false, //important
        data: jest.fn().mockReturnValue({ expoToken })
      }

      tokenRef = {
        get: jest.fn().mockResolvedValue(doc)
      };
      db = {
        doc: jest.fn().mockReturnValue(tokenRef)
      };

      notificationController = notificationControllerFactory(db, sendNotificationNotCalled);
      req.body = body; 
    });

    test('should respond with also with success', async () => {
      await notificationController.post(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(sendNotificationNotCalled).not.toHaveBeenCalled();
    });
  });
});