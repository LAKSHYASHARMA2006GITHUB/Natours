//  4.SERVER Starting
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('UncaughtException', (err) => {
  console.log('Uncaught Exception shutting down..');
  console.log(err.name, err.message);
    process.exit(1); //0 for the success  //1 for uncaught exception

});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connections successful'));

const port = 3000;
// console.log(process.env);
const server = app.listen(3000, () => {
  console.log(`server is listing on the ${port}...`);
});

process.on('unhandledRejection',err =>{
  console.log('Unhandled Rejection shutting down..');
  console.log(err.name,err.message);
  server.close(()=>{
    process.exit(1); //0 for the success  //1 for uncaught exception
  });
});


//test