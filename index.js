const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const logger = require('morgan');
const https = require('https');
const http = require('http');
const ejs = require('ejs');
// --- BANCO DE DADOS --- //
// const sqlite = require('sqlite3'); // SQLITE
const { MongoClient } = require('mongodb'); // MONGODB
const mysql = require('mysql'); // MYSQL
// --- FIM BANCO DE DADOS --- //
const {Server} = require('socket.io');

// --- BANCO DE DADOS --- //

// SQLITE
// const sdb = new sqlite.Database('data.db');

// MONGO DB

const cMongoDB = new MongoClient('mongodb+srv://juliobenin:vM7U9js1zuXazT5E@cluster0.l7zkjlq.mongodb.net/?retryWrites=true&w=majority');

cMongoDB.connect();
const con = cMongoDB.db('SystemaGestao');

/*
// MYSQL
const con = mysql.createConnection({
    host: 'localhost',
    user: 'nodeMaster',
    password: 'nodeMast&r*',
    database: 'nodeInit',
});

con.connect();
*/

// --- FIM BANCO DE DADOS --- //

// --- FUNÇÕES LOCAIS --- //
const routers = require('./router/router')(con);
const socketEvents = require('./socket/socket');

//
const port = 3000;
const app = express();

// Se HTTPS difinir como true
const server = (false)?https.createServer(app):http.createServer(app);

//
const io = new Server(server);

// Socket.IO Middleware
io.on('connection',(socket)=>{socketEvents(io,socket,con)});

//
app.set('view engine','ejs');
app.set('views','./views');
app.set('trust proxy',1);

//
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

//
server.listen(port);
console.log(`Sistema funcionando na porta ${port}`);

