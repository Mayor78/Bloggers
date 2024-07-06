const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;


const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: "http://localhost:5174",
  methods: ["POST", "GET", "PATCH", "PUT", "DELETE", 'OPTIONS']
}));
app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.options('*', cors()); // Handle preflight requests

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
  .then(() => {
    const sslOptions = {
        key: fs.readFileSync('./cert/server.key'), // Adjust path if needed
        cert: fs.readFileSync('./cert/server.cert') // Adjust path if needed
    };
    

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on https://localhost:${process.env.PORT || 8000}`);
    });
  })
  .catch(error => console.log('Error connecting to MongoDB:', error));
