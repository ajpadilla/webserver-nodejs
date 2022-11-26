const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const {request, response} = require("express");
const {subirArchivo} = require("../helpers");
const {Usuario, Producto} = require("../models");


const cargarArchivo = async (req = request, res = response) => {
    try {
        const nombre = await subirArchivo(req.files, ['jpg','txt', 'md'], 'textos');
        res.json({path: nombre})
    } catch (error) {
        res.status(400).json({error});
    }
}

const actualizarImagen = async (req = request, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo){
                return res.status(400).json({msg: `No esiste un usuario con el id ${id}`})
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo){
                return res.status(400).json({msg: `No esiste un producto con el id ${id}`})
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    await modelo.save();

    res.json({modelo});
};


const mostrarImage = async (req = request, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo){
                return res.status(400).json({msg: `No esiste un usuario con el id ${id}`})
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo){
                return res.status(400).json({msg: `No esiste un producto con el id ${id}`})
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImage
}