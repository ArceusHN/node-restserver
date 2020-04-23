
const express = require('express')

const bcrypt = require('bcrypt')

const Usuario = require('../models/usuario')

const {verificaToken,verificaAdmin_Role} = require('../middlewares/authentication')

const app = express()


app.get('/usuario',verificaToken ,function (req, res) {
    

    let desde = req.query.desde || 0,
        limite = req.query.limite || 5,
        estado = req.query.estado || false

    desde = Number(desde)
    limite = Number(limite)
    estado = Boolean(estado)
    
    Usuario.find({}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

    Usuario.count({estado}, (err,conteo)=>{

        res.json({
            ok:true,
            usuarios,
            conteo
        })
    })
                
            })
    
  })
  

app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err,usuarioDB) =>{

    if(err){
        return res.status(400).json({
            ok: false,
            err
        })
    }

    // usuarioDB.password = null

    res.json({
        ok: true,
        usuario: usuarioDB
    })
    })
    
})



app.put('/usuario/:id', [verificaToken, verificaAdmin_Role] , function (req, res) {
    
    let id = req.params.id //Toma el parametro ID
    let {nombre,email,img,role,estado} = req.body
    
    let body = {nombre,email,img,role,estado}

    Usuario.findByIdAndUpdate(id,body,{new: true, runValidators: true, context: 'query' }, (err,usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role] , function (req, res) {
    
    let id = req.params.id

    //Borrar un usuario de la DB
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{

    //     if(err){
    //         return res.status(400).json({
    //             ok: true,
    //             err
    //         })
    //     }

    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         }) 
    //     }

    //     res.json({
    //         ok: true,
    //         usuarioBorrado
    //     })

    // })

    Usuario.findByIdAndUpdate(id,{estado : false},{new: true},(err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            usuarioDB
        })


    })

})


  module.exports = app