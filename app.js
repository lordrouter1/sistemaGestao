const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const logger = require('morgan');
const https = require('https');
const http = require('http');
const ejs = require('ejs');
const fs = require('fs');

const cfg = /*Dev?*/(true)?require('./configs/dev.json'):require('./configs/prod.json');

const { MongoClient } = require('mongodb'); // MONGODB

const {Server} = require('socket.io');

const cMongoDB = new MongoClient(cfg.db.mongodb.url);
cMongoDB.connect();
const con = cMongoDB.db(cfg.db.mongodb.dbMaster);

// --- FUNÇÕES LOCAIS --- //
const routers = require(cfg.routers.path)(con,cMongoDB);
const socketEvents = require(cfg.socket.path);

//
const app = express();

// Se HTTPS difinir como true
const server = (cfg.https)?https.createServer(app):http.createServer(app);

// Session Config
const confSession = session(cfg.session.config)

//
const io = new Server(server);
const wrap = middleware => (socket,next) => middleware(socket.request,{},next);
io.use(wrap(confSession));
io.use((socket,next)=>{ if(socket.request.session.user){ next(); } else { next(new Error('Nao Autorizado')); }});

// Socket.IO Middleware
io.on('connection',(socket)=>{socketEvents(io,socket,cMongoDB)});

app.set('view engine','ejs');
app.set('views',__dirname+cfg.view.path);
app.set('trust proxy',1);

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use(helmet(cfg.helmet.init));
app.use(helmet.contentSecurityPolicy(cfg.helmet.csp));

app.use(logger(cfg.logger));
app.use(cfg.public.url,express.static(__dirname+cfg.public.path));
app.use(confSession);
app.use(routers);
//
server.listen(cfg.port);
console.log(`\nSistema funcionando na porta ${cfg.port}`);

