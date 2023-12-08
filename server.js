const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connection Succeed!'));

// Server
const port = process.env.PORT || 3001;

app.listen(port, '127.0.0.1', () => {
  console.log('Server running ...');
});
