import mongoose from 'mongoose';
import { config } from 'dotenv';
import app from './app.js';

config({
  path: './.env',
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!! shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const database = process.env.DATABASE;
// Connect the database
mongoose
  .connect(database, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection Successfully!');
  });

// Start the server
const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

// Close the Server
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!!  shutting down ...');
  console.log(err.name, err.message);

  // if don't need this line are removed
  // server.close(() => {
  //   process.exit(1);
  // });
});
