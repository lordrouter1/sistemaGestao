const express = require('express');
const gridjs = require('gridjs');

module.exports = function(con){
    const routers = express.Router();

    routers.get('/',(req,res)=>{
        res.render('index',{title:'Dashboard'});
    });

    routers.get('/clientes',(req,res)=>{
        res.render('clientes/index',{
            title:'Clientes',
            clienteData: `[
                ["PJ","Julio Cesar Benin Kronhardt","54999994316",gridjs.html('<a class="btn btn-secondary mr-2 text-light"><i class="fa-solid fa-pen"></i></a><a class="btn btn-danger text-light"><i class="fa-solid fa-trash-can"></i></a>')],
            ]`
        });
    });

    return routers;
};