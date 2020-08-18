const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 9000;

//connect to mongodb
const uri = process.env.DB_CONNECT;
mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, () => {console.log('connected to mongodb')});

//middleware
app.use(express.json());

const corsOptions = {
    exposedHeaders: 'Authorization',
  };
app.use(cors(corsOptions));

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Route middleware
app.use('/api/user', authRoute);
app.use('/api', postRoute);

app.listen(port, () => console.log("listening to port 9000"));