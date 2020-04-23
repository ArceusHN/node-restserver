const express = require('express')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const app = express()


app.post('/login', (req,res)=>{

    let body = req.body

    Usuario.findOne({email : `${body.email}`}) // Consulta para buscar el email 
        .exec((err,usuarioDB) =>{

            if( err ){ // Si hay un error interno
                return res.status(500).json({
                    ok:false,
                    message: `Ha habido un error ${err.message}`
                })
            }

            if(!usuarioDB){ // Si no existe el usuario o email
                return res.status(400).json({
                    ok:false,
                    message:"(Usuario) o contraseña incorrectos"
                })
            }

            
            if( !bcrypt.compareSync(body.password, usuarioDB.password) ){// Si la contraseña es incorrecta
                return res.status(400).json({
                    ok:false,
                    message:"Usuario o (contraseña) incorrectos"
                })
            }

            let token = jwt.sign({ //Generando un Token
                usuario: usuarioDB
            }, process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN})

            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })


        })
})
















module.exports = app