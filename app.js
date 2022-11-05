const express = require('express');
require('dotenv').config();
const app = express();


//regular middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//router
const emailRoute = require('./routes/routes.js');

//router middleware
app.use('/api/email/', emailRoute)

module.exports = app;