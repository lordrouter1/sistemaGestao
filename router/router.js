const express = require('express');

const routers = express.Router();

routers.get('/login',(req,res)=>{
    res.send('Login!');
});

routers.get('/',(req,res)=>{
    res.send('Rotas!');
});

module.exports = routers;