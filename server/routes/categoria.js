
const express = require('express'),
 {verificaToken,verificaAdmin_Role} = require('../middlewares/authentication'),
 app = express(),
 Categoria = require('../models/categoria')

 require('../models/usuario')


 // =====================================
 // Mostrar todas las categorias 
 // =====================================


 app.get('/categoria', verificaToken ,(req, res)=>{
    
    Categoria.find({})
             .sort('descripcion') //Ordenar por campo descripcion
             .populate('usuario', 'nombre email')
             .exec((err,categorias)=>{

                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Categoria.count({}, (err,conteo)=>{
                    res.json({
                        ok:true,
                        categorias,
                        conteo
                    })
                })
                    
             })

 })


 // =====================================
 // Mostrar una categoria
 // =====================================

 app.get('/categoria/:id', verificaToken, (req, res)=>{
    
    const categoriaId = req.params.id

    Categoria.findById(categoriaId) //No van entre llaves
             .exec((err,categoriaDB) =>{

                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    categoria: categoriaDB
                }) 

             })

 })


 // =====================================
 // Crear nueva categoria
 // =====================================

 app.post('/categoria', verificaToken, (req,res)=>{

    const body = req.body
    
    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

 })


 // =====================================
 // Actualizar esta categoria
 // =====================================

 app.put('/categoria/:id', verificaToken ,(req,res)=>{

    const id = req.params.id
    const {descripcion} = req.body
    const body = {descripcion}

    

    Categoria.findByIdAndUpdate(id, body , {new: true, runValidators: true}, (err, categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            
        })

    })
 })

 // =====================================
 // Eliminar categoria - Solo admin puede borrar categoria
 // =====================================

 app.delete('/categoria/:id', verificaToken,verificaAdmin_Role,(req,res)=>{

    const id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) =>{

        if(err){
            return res.status(500).json({
                ok: true,
                err
            })
        }

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            }) 
        }

        res.json({
            ok: true,
            categoriaBorrada
        })
    })

 })


module.exports = app
 