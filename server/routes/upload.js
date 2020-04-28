const express = require('express'),
      fileUpload = require('express-fileupload'),
      app = express(),  
      Usuario = require('../models/usuario'),
      Producto = require('../models/producto'),
      fs = require('fs'),
      path = require('path')

    //Todos los archivos que se carguen caen en req.files
    app.use( fileUpload({ useTempFiles: true }) )

    //Tipo: Usuario o Producto y el ID 
    app.put('/upload/:tipo/:id', (req,res)=>{

        let tipo = req.params.tipo,
            id = req.params.id

        if(!req.files){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'No se ha seleccionado ningun archivo'
                }
            })
        }

        //Validar tipo

        let tiposValidos = ['productos','usuarios']

        if( tiposValidos.indexOf(tipo) < 0){
            return res.status(400).json({
                ok:false,
                err:{
                    message:`Los tipos permitidos son: ${tiposValidos.join(', ')}`
                }
            })
        }

        let archivo = req.files.archivo
        let nombreCortado = archivo.name.split('.')
        let extension = nombreCortado[nombreCortado.length - 1]

        //Extensiones permitidas

        let extensionesValidas = ['png','jpg','gif','jpeg']

        if( extensionesValidas.indexOf(extension) < 0 ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: `Las extensiones permitidas son ${extensionesValidas.join(', ')}`,
                    ext: extension
                }
            })
        }
        
        //Renombrar el nombre del archivo

        let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

        archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) =>{

            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            // Imagen ya cargada. 
            
            if(tipo==='usuarios'){
                imagenUsuario(id,res,nombreArchivo)
            }else{
                imagenProducto(id,res,nombreArchivo)
            }
            

        })


    })


    function imagenUsuario(id, res, nombreArchivo){

        Usuario.findById(id,(err,usuarioDB)=>{

            if(err){
                borraArchivo(nombreArchivo, 'usuarios')
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            if(!usuarioDB){
                borraArchivo(nombreArchivo, 'usuarios')
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:`Usuario no existe`
                    }
                })
            }


            borraArchivo(usuarioDB.img, 'usuarios')

            usuarioDB.img = nombreArchivo

            usuarioDB.save((err,usuarioGuardado)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
    
                res.json({
                    ok:true,
                    usuario: usuarioGuardado,
                    img: nombreArchivo
                })
            })

        })

    }



    function imagenProducto(id, res, nombreArchivo){
        
        Producto.findById(id, (err,productoDB)=>{

            if(err){
                borraArchivo(nombreArchivo, 'productos')
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            if(!productoDB){
                borraArchivo(nombreArchivo, 'productos')
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:`Usuario no existe`
                    }
                })
            }

            
            borraArchivo(productoDB.img, 'productos')

            productoDB.img = nombreArchivo

            productoDB.save((err,productoGuardado)=>{

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    usuario: productoGuardado,
                    img: nombreArchivo
                })

            })
        })
    }


    function borraArchivo(nombreImagen, tipo){
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

        if(fs.existsSync(pathImagen)){//Validando que exista la imagen en la ruta
            fs.unlinkSync(pathImagen) //Elimina la imagen de la ruta especificada
        }

    }

module.exports = app