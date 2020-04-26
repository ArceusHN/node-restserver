const {Schema,model} = require('mongoose')


const categoriaSchema = new Schema({

    descripcion:{
        type: String,
        required: [true, 'La descripcion de la categoria es necesaria'],
        unique: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: [true, 'El usuario es requerido'] 
    }
})


module.exports = model('Categorias',categoriaSchema)