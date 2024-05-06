const express = require("express");
const mongoose = require("mongoose");
const UserHttpRoutes = require('./routes/routers');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const debug = require('debug')('app:startup');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;
const secretKey = process.env.SECRET_KEY;

app.get("/", (req, res) => res.send("Home Route in Index.js"));

app.use(process.env.ALL_DATA_API, UserHttpRoutes);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => debug("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

app.use((req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');
  
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
});

app.get('/generate-token', (req, res) => {
  const token = jwt.sign({ username: 'example_user' }, secretKey);
  res.send(token);
});

app.listen(port, () => {
  debug(`Server running on port ${port}`);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
});