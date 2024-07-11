const express = require('express');
var cors = require('cors');
const app = express();
app.use(require("body-parser").json())
const connection = require('./connection');
const userRoute=require('./routes/user.js');
const transactionRoute=require('./routes/transaction.js');
app.use(cors()) ;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('transaction',transactionRoute)
module.exports = app;
