const Role = require("../models/role");
const Usuario = require('../models/Usuario');
const {Categoria, Producto} = require("../models");

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
};

const emailExiste = async(correo = '')  => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya está registrado`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeusuario = await Usuario.findById(id);
    if (!existeusuario){
        throw new Error(`El id no existe ${id}`);
    }
};

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria){
        throw new Error(`El id no existe ${id}`);
    }
};

const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto){
        throw new Error(`El id no existe ${id}`);
    }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incliuda = colecciones.includes(coleccion);

    if (!incliuda){
        throw new Error(`La coleccion ${ coleccion } no esta permitida, ${ colecciones }`);
    }
    return true;
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}