const { Router } = require('express');
const {buscar} = require("../controllers/buscar");

const route = Router();

route.get('/:coleccion/:termino', buscar);

module.exports = route;