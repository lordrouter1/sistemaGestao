const express = require('express');
const gridjs = require('gridjs');
const ObjectId = require('mongodb').ObjectId;
const multer = require(`multer`);
const fs = require(`fs`);

module.exports = function(con,cMongoDB){
    let routers = express.Router();
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `public/img/`); // Pasta onde os uploads serão armazenados
        },
        filename: function (req, file, cb) {
          cb(null, `${req.session.user.database}-${Date.now()}-${file.originalname}`); // Nome do arquivo de upload
        }
    });
    const upload = multer({ storage: storage });

    // --- LOGIN ---
    function checkLogin(req,res,next){
        if(req.session.user){
            next();
        }
        else{
            res.redirect('/login');
        }
    }

    // --- INCLUSAO DAS ROTAS ---
    fs.readdirSync(__dirname+`\\rotas`).forEach(arq=>{
        const rota = arq.split(`.`)[0];
        console.log(`[rota] ${rota} adicionada`);
        routers = require(`./rotas/${rota}`)(checkLogin,routers,con,cMongoDB,{upload:upload});
    });

    // --- INDEX---
    routers.get('/',checkLogin,(req,res)=>{
        res.render('index',{title:'Dashboard'});
    });

    // --- UPLOAD ---
    routers.route(`/fUpload`,checkLogin)
    .post(upload.single(`imagens`),(req,res)=>{
        res.status(200).send(req.file.filename);
    })
    .delete((req,res)=>{
        fs.stat(`public\\img\\`+req.body,(err,stat)=>{
            if(err == null){
                fs.unlinkSync(`public\\img\\`+req.body);
                res.status(200).send(`0`);
            }else{
                res.status(404).send(`-1`);
            }
        });
    });
    
    return routers;
};