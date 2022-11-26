const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const {cargarArchivo, actualizarImagen, mostrarImage} = require("../controllers/uploads");
const {coleccionesPermitidas} = require("../helpers");
const {validarArchivoSubir} = require("../middlewares");

const route = Router();

route.post('/', validarArchivoSubir, cargarArchivo);

route.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagen);

route.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImage);

module.exports = route;