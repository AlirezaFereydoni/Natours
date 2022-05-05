const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// Server

const port = process.env.PORT || 3000;

app.listen(port, '127.0.0.1', () => {
  console.log('Server running ...');
});
