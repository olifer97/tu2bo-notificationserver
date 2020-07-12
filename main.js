require('dotenv').config();
const app = require('./src/app');
const db = require('./src/db')();

const main = () => {
  const port = process.env.PORT;

  app(db).listen(port, () => {
    console.log(`Notification server up in port ${port}!`);
  });
};

process.on('SIGINT', () => process.exit());

if (require.main === module) {
  main();
}
