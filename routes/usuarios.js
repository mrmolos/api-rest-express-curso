const express = require('express');
const Joi = require('@hapi/joi');//modulo para validacion
const ruta = express.Router();

ruta.get('/', (req, res) => {
    res.send(usuarios);
});

//PARAMETROS EN LAS RUTAS
/*
ruta.get('//:id', (req, res) => {
    res.send(req.params.id);
})// en el navegador http://localhost:5000//1122 en la pantalla imprime 1122
//otro ejemplo:
ruta.get('//:year/:month', (req, res) => {
    res.send(req.query);//imprime {"year":"numero","month":"numero"}
})// http://localhost:5000//1987/05?sexo=M IMPRIME {"sexo":"M"}
*/


//METODO GET--OBTIENE INFO
ruta.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no ha sido encontrado, cagonros');
    res.send(usuario);
});


//Datos de prueba para la app
const usuarios = [
    { id: 1, nombre: 'Robert' },
    { id: 2, nombre: 'Alejo' },
    { id: 3, nombre: 'oskar' }
]

//METODO POST--DA INFO
ruta.post('/', (req, res) => {

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
ruta.put('/:id', (req, res) => {
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
ruta.delete('/:id', (req, res) => {
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

//Exportando el módulo
module.exports = ruta;