const { request, response } = require('express');
const {Usuario, Categoria, Producto} = require("../models");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {
    const esMondoId = ObjectId.isValid(termino);

    if (esMondoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({ results: (usuario) ? [usuario] : [] });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{nombre: regex} , {correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({results: usuarios});
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMondoId = ObjectId.isValid(termino);

    if (esMondoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({ results: (categoria) ? [categoria] : [] });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
       nombre:regex, estado: true
    });

    res.json({results: categorias});
};

const buscarProductos = async (termino = '', res = response) => {
    const esMondoId = ObjectId.isValid(termino);

    if (esMondoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({ results: (producto) ? [producto] : [] });
    }

    const regex = new RegExp(termino, 'i');
    /*const productos = await Producto.find({ nombre: regex, estado: true, categoria: ObjectId('636866853d1a81f5fd5833d5' +
            '') }).populate('categoria', 'nombre');;*/

    productos = await Producto.find({estado: true }).populate({
        path: 'categoria',
        match: {'nombre': {$eq: 'GALLETA DULCE'}}
    }).then((productos) => productos.filter((producto => producto.categoria !=null)));

    res.json({results: productos});
};

const buscar = (req = request, res = response ) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las coleciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            });
    }
};

module.exports = {
    buscar
};