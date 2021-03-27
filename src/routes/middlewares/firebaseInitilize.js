var admin = require("firebase-admin");

var serviceAccount = require("../../../agenda-medica-3418b-firebase-adminsdk-vgz6g-0a19b03ebc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;