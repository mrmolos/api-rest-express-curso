//Importando modulos
const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db')

const express = require('express');
//sugerencia de es6 import express from 'express'
const logger = require('./logger');//prueba de modulo externo propio
const Joi = require('@hapi/joi');//modulo para validacion
const morgan = require('morgan');//HTTP request logger middleware for node.js
const config = require('config');//modulo para configurar entorno de trabajo


const app = express();

//use es la middleware que hace de link entre lo que introduce el usuario y el servidor https://expressjs.com/es/4x/api.html#app.use
app.use(express.json());//https://expressjs.com/es/4x/api.html#express.json
app.use(express.urlencoded({ extended: true }));//permite pasar datos codificados en la url
app.use(express.static('public'));//permite publicar archivos


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



//Datos de prueba para la app
const usuarios = [
    { id: 1, nombre: 'Robert' },
    { id: 2, nombre: 'Alejo' },
    { id: 3, nombre: 'oskar' }
]




//Usando metodo get para enviar un mensaje en el navegador en la raiz y en la ruta api/usuarios
app.get('/', (req, res) => {
    res.send('hola desde express usando nodemon');
});//en localhost:3000 imprime el mensaje "hola desde express"

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

//PARAMETROS EN LAS RUTAS
/*
app.get('/api/usuarios/:id', (req, res) => {
    res.send(req.params.id);
})// en el navegador http://localhost:5000/api/usuarios/1122 en la pantalla imprime 1122
//otro ejemplo:
app.get('/api/usuarios/:year/:month', (req, res) => {
    res.send(req.query);//imprime {"year":"numero","month":"numero"}
})// http://localhost:5000/api/usuarios/1987/05?sexo=M IMPRIME {"sexo":"M"}
*/


//METODO GET--OBTIENE INFO
app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no ha sido encontrado, cagonros');
    res.send(usuario);
});


//METODO POST--DA INFO
app.post('/api/usuarios', (req, res) => {

    /*
    const body = req.body;
    console.log(body.nombre);
    res.json({
        body
    })
    */

    //validacion con el modulo joi
    /* const schema = Joi.object({
         nombre: Joi.string()
             .min(3)
             .required()
     });*/

    const { error, value } = validarUsuario(req.body.nombre);
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

    /*
    if (!req.body.nombre || req.body.nombre.length <= 2) {
        //400=BAD REQUEST
        res.status(400).send('Debe ingresar un nombre y con un mínimo de tres letras');
        return;
    }
    */

});

//METODO PUT-- ACTUALIZAR INFO
app.put('/api/usuarios/:id', (req, res) => {
    //1º encontrar si existe el usuario
    //let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no ha sido encontrado, cagonros');
        return;
    }



    const { error, value } = validarUsuario(req.body.nombre);
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

//METODO DELETE-BORRAR ALGO
app.delete('/api/usuarios/:id', (req, res) => {
    //existe el usuario?
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no ha sido encontrado, cagonros');
        return;
    }
    // encontrar el elemento del array
    const index = usuarios.indexOf(usuario);
    //borrar elemento del array
    usuarios.splice(index, 1);
    //mandando el array usuarios resultante sin el elemento borrado
    res.send(usuarios);
});

//VARIABLE DE ENTORNO
const port = process.env.PORT || 3000;//Para dar valor diferente a esta variable habrá que 
//hacerlo desde la consola mediante set PORT=1234


//ESCUCHA DEL PUERTO
app.listen(port, () => {
    console.log(`escuchando en el puerto ${port} con la variable de entorno`);
});//escucha el puerto 3000 y en la consola imprime el mensaje


//VALIDACION CON FUNCIONES
function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    });
    return (schema.validate({ nombre: nom }));
}