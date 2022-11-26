const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require("../middlewares/validar-campos");
const {obtenerCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria} = require("../controllers/categorias");
const {validarJwt, esAdminRole} = require("../middlewares");
const {existeCategoriaPorId} = require("../helpers/db-validators");

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id',
    [
        check('id', 'No es un id de Mogo válido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    obtenerCategoria);

router.post('/',[
        validarJwt,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearCategoria);

router.put('/:id', [
    validarJwt,
    check('id', 'No es un id de Mogo válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos

],actualizarCategoria);

router.delete('/:id', [
    validarJwt,
    esAdminRole,
    check('id', 'No es un id de Mogo válido').isMongoId(),

],borrarCategoria);

module.exports = router;

