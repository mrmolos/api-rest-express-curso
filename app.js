//Importando modulos
const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const usuarios = require('./routes/usuarios');
const express = require('express');
//sugerencia de es6 import express from 'express'
const logger = require('./logger');//prueba de modulo externo propio

const morgan = require('morgan');//HTTP request logger middleware for node.js
const config = require('config');//modulo para configurar entorno de trabajo


const app = express();

//use es la middleware que hace de link entre lo que introduce el usuario y el servidor https://expressjs.com/es/4x/api.html#app.use
app.use(express.json());//https://expressjs.com/es/4x/api.html#express.json
app.use(express.urlencoded({ extended: true }));//permite pasar datos codificados en la url
app.use(express.static('public'));//permite publicar archivos
app.use('/api/usuarios', usuarios);


//Configuracion de entornos
console.log('Aplicacion: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//Uso de un middleware de terceros
//MORGAN
//morgan loggea las peticiones http. Estas aparecen en la consola
//ejemplo: GET /api/usuarios 200 80 - 5.270 ms --(metodo direccion status longitud de respuesta tiempo)
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //console.log('morgan habilitado');
    inicioDebug('Morgan está habilitado.')
}//Usamos morgan solo en entorno de desarrollo

//TRABAJOS CON LA BASE DE DATOS
dbDebug('Conectando con la base de datos');


/* metodos para los datos

app.get(); //peticion
app.post() //envio de datos
app.put(); //actualizacion
app.delete(); //borrar

*/

//app.use(logger);

/* app.use(function (req, res, next) {
    console.log('uouoooooo');
    next();
}); */








//Usando metodo get para enviar un mensaje en el navegador en la raiz y en la ruta api/usuarios
app.get('/', (req, res) => {
    res.send('hola desde express usando nodemon');
});//en localhost:3000 imprime el mensaje "hola desde express"



//VARIABLE DE ENTORNO
const port = process.env.PORT || 3000;//Para dar valor diferente a esta variable habrá que 
//hacerlo desde la consola mediante set PORT=1234


//ESCUCHA DEL PUERTO
app.listen(port, () => {
    console.log(`escuchando en el puerto ${port} con la variable de entorno`);
});//escucha el puerto 3000 y en la consola imprime el mensaje


