
const jwt = require('jsonwebtoken')

// =====================
//  Verificar token
// =====================

const verificaToken = ( req, res, next ) =>{ // Middleware que va a verificar el token

    let token = req.get('token') //Obtener el token el header
    
    jwt.verify(token, process.env.SEED, (err,decoded)=>{

        if( err ){
            return res.status(401).json({
                ok:false,
                err: {
                    message: "Token no valido"
                }
            })
        }

        req.usuario = decoded.usuario//Payload
        
        next()

    })

}

const verificaAdmin_Role = (req,res,next) => { // Middleware que va a verificar los permisos de Administrador

    let userRole = req.usuario.role

    if(!(userRole == "ADMIN_ROLE")){
        return res.status(401).json({
            ok:false,
            err: {
                message: "El usuario no es administrador"
            }
        })
    }

    next()
} 



module.exports = {
    verificaToken,
    verificaAdmin_Role
}