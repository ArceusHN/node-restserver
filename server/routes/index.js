const express = require('express')
const app = express()

app.use(require('./usuario'))//Importamos y usamos las rutas de usuario

app.use(require('./login'))

module.exports = app