require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOption');
const credentials = require('./middleware/credentials');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// connect to monogoDB
connectDB();

// custom middleware logger
app.use(logger);

//Handle options credentials check - before CORS!
// and fetch cookies credentials requirement

app.use(credentials);

// cross origin resource sharing

app.use(cors(corsOptions));

// built in middleware to handle encoded data that is form data
app.use(express.urlencoded({ extended: false }));

// buitin middleware to handle json data
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// to serve static files
app.use(express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public'))); //for subdirectory

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

//route protection
// app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
  if (req.accepts('.html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('.json')) {
    res.json({ error: '404 not found' });
  } else {
    res.type('txt').send('404 not found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('connected to MongoDB');
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});
