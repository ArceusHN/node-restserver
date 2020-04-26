const express = require('express'),
      app = express(),
      {verificaToken} = require('../middlewares/authentication'),
      Producto = require('../models/producto')

    //============================
    //  Obtener todos los productos
    //============================
    /*
        Populate y paginado
    */

    app.get('/productos', verificaToken , (req,res)=>{
        
        let desde = req.query.desde || 0
            limite = req.query.limite || 5


        desde = Number(desde)
        limite = Number(limite)

        Producto.find({disponible:"true"})
                .skip(desde)
                .limit(limite)
                .populate('usuario', 'nombre email')
                .populate('categoria', 'descripcion')
                .exec((err,productosDB)=>{
                    if(err){
                        return res.status(500).json({
                            ok:false,
                            err
                        })
                    }

                    res.json({
                        ok:true,
                        productos: productosDB
                    })
                })
                
    })

    //============================
    //  Obtener un producto
    //============================


    app.get('/productos/:id', (req,res)=>{

        let id = req.params.id

        Producto.findById(id)
                .populate('usuario', 'nombre email')
                .populate('categoria', 'descripcion')
                .exec((err,productoDB)=>{

                    if(err){
                        return res.status(500).json({
                            ok:false,
                            err
                        })
                    }

                    if(!productoDB){
                        return res.status(400).json({
                            ok:false,
                            err:{
                                message: 'ID no existe'
                            }
                        }) 
                    }


                    res.json({
                        ok:true,
                        producto:productoDB
                    })
                })
    })

    //============================
    //  Buscar productos
    //============================

    app.get('/productos/buscar/:termino', verificaToken, (req,res)=>{

        let termino = req.params.termino
        //Busquedas más flexibles
        let regex = new RegExp(termino, 'i') //Expresion regular, que no sea case sensitive
     
        Producto.find({nombre: regex})
                .populate('categoria', 'descripcion')
                .exec((err,productosDB)=>{
                    if(err){
                        return res.status(500).json({
                            ok:false,
                            err
                        })
                    }

                    res.json({
                        ok:true,
                        productos: productosDB
                    })
                })

    })


    //===============================
    //  Crear un producto
    //===============================

    app.post('/productos', verificaToken, (req, res)=>{
        const body = req.body
        // const categoria = mongoose.Types.ObjectId(body.categoria) Instanciar objectID

        console.log(categoria)

        const producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria,
            usuario: req.usuario._id
        })

        producto.save((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }   
    
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
    
            res.json({
                ok: true,
                producto: productoDB
            })
        })

    })

    //===============================
    //  Actualizar un nuevo producto
    //===============================

    app.put('/productos/:id', verificaToken, (req, res)=>{
        
        const id = req.params.id,
              {descripcion,nombre,precioUni} = req.body,
              body = {descripcion,nombre,precioUni}

              Producto.findByIdAndUpdate(id,body, {new:true, runValidators: true}, (err,productoDB)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                if(!productoDB){
                    res.status(400).json({
                        ok:false,
                        err:{
                            message:`El producto no existe en la DB`
                        }
                    })
                }
        
                res.json({
                    ok: true,
                    producto: productoDB,
                    
                })
              })

    })


    //===============================
    //  Borrar un producto
    //===============================

    //Producto ha sido deshabilitado
    app.delete('/productos/:id', verificaToken, (req, res)=>{
        const id = req.params.id
              
              Producto.findByIdAndUpdate(id,{disponible:false}, {new:true, runValidators: true}, (err,productoDB)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
        
                res.json({
                    ok: true,
                    producto:{
                        message: 'El producto ha sido deshabilitado',
                        productoDB
                    }
                    
                })
              })
    })
















module.exports = app