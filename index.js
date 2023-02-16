const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const logger = require('morgan');
const https = require('https');
const ejs = require('ejs');
const sqlite = require('sqlite3');

const routers = require('./router/router');

const db = new sqlite.Database('data.db');

const port = 3000;
const app = express();

app.set('view engine','ejs');
app.set('views','./views');
app.set('trust proxy',1);

app.use(routers);
app.use(helmet());
app.use(logger('dev'));
app.use('/public/',express.static('./public'));
app.use(session({
    secret: '123456789',
    name: 'sessão',
    resave: false,
    saveUninitialized: true,
    cookie:{
        secure: false,
        httpOnly: true,
        path:'/',
        expires: false
    }
}));

app.listen(port);
console.log(`Sistema funcionando na porta ${port}`);

