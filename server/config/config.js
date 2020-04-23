
//============================
// Puerto
//============================

process.env.PORT = process.env.PORT || 3000



//============================
// Entorno
//============================

//HEROKU crea esa propiedad
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//============================
// Vencimiento del Token
//============================
// 60 seg * 60 seg * 24 horas * 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


//============================
// SEED de autenticacion
//============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//============================
// Entorno
//============================

let urlDB

if(process.env.NODE_ENV === 'dev'){
   urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI
}


process.env.URLDB = urlDB // Nos inventamos esa propiedad y le asignamos el urlDB
