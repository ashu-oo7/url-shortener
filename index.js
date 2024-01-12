const express = require('express');
const app = express();
const PORT = 8001;
const router = require('./views/view.js');
const  ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');

const {createConnection} = require('./models/model');
createConnection();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.use('/',router);
app.set('view engine','ejs');

app.set('views',path.resolve('./views'));
app.listen(PORT,()=>console.log('SERVER STARTED'));