
const {Schema,model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let rolesValidos={
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'La contraseña es obligatoria']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //Enumeracion para verificar los roles
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
})

usuarioSchema.methods.toJSON = function(){
    const userObject = this.toObject()
    delete userObject.password

    return userObject
}   

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})

module.exports = model('Usuarios',usuarioSchema)

