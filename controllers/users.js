const { request, response } = require('express');
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
    //const query = req.query;
    // Desectructuración const { q, nombre='No name', apiKye } = req.query

    const {limit = 5, desde = 0} = req.query;
    const query = {estado: true}

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true});

    res.json(usuario);
}

const usuariosPost = async (req, res = response) => {
    //se puede desectructurar {nombre, apellido} = req.body
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    await usuario.save();

    res.json({
        'message': 'Post desde el controllerrr',
        usuario
    });
};

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;
    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(usuario);
};
const usuariosPatch = (req, res = response) => {
    res.json({'message': 'Patch desde el controller'});
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}