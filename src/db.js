const admin = require("firebase-admin");

let serviceAccount = require("../tu2bo-131ec-32a6ace4f2e8.json"); //secret ask oli

module.exports = function db() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  return admin.firestore();
};
