const express = require('express'),
      fs = require('fs'),
      app = express(),
      path = require('path'),
      {verificaTokenImg} = require('../middlewares/authentication')


    app.get('/imagen/:tipo/:img', verificaTokenImg, (req,res)=>{

        let tipo = req.params.tipo,
            img = req.params.img


        let pathImg =  `./uploads/${tipo}/${img}`
        
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)       
        

        if(fs.existsSync(pathImagen)){
            res.sendFile(pathImagen)
        }else{
            let noImagePath = path.resolve(__dirname,'../assets/original.jpg')
            res.sendFile(noImagePath)
        }
        

    })























      module.exports = app