const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const requireDir = require('require-dir');
require('dotenv-safe').load();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/apinode', { useNewUrlParser: true });
requireDir('./src/models');
app.use('/api', require('./src/routes'));

app.listen(3001, () => console.log('Servidor ouvindo porta 3001'));