require('dotenv').config();
const app = require('./src/app');
const db = require('./src/db')();


const main = () => {
  const app_port = process.env.PORT;
  
  app(db).listen(app_port, () => {
    console.log(`Notification server up in port ${app_port}!`);
  });
};


process.on('SIGINT', function() {
  process.exit();
});

if (require.main === module) {
  main();
}