
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
// Entorno
//============================

let urlDB

if(process.env.NODE_ENV === 'dev'){
   urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI
}


process.env.URLDB = urlDB // Nos inventamos esa propiedad y le asignamos el urlDB
