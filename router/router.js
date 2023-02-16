const express = require('express');

const routers = express.Router();

routers.get('/',(req,res)=>{
    res.render('index',{title:'inicio'});
});

module.exports = routers;