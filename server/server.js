require('./config/config')

const express = require('express')
const mongoose = require('mongoose')

const app = express()

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))//Importamos y usamos las rutas de usuario
 

mongoose.connect(process.env.URLDB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex : true
})
.catch(console.log)

mongoose.connection.once('open', () =>{
  console.log('Base de datos ONLINE');
})

 
app.listen(process.env.PORT, ()=> console.log(`Escuchando puerto: ${process.env.PORT}`))