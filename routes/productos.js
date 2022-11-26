const { Router } = require('express');
const { check } = require('express-validator');
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require("../controllers/productos");
const {existeProductoPorId, existeCategoriaPorId} = require("../helpers/db-validators");
const {validarCampos, validarJwt, esAdminRole} = require("../middlewares");

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un id de Mogo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

router.post('/',[
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

router.put('/:id',[
    validarJwt,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] ,actualizarProducto);

router.delete('/:id', [
    validarJwt,
    esAdminRole,
    check('id', 'No es un id de Mogo válido').isMongoId(),
    check('id').custom(existeProductoPorId)
],borrarProducto);

module.exports = router;

