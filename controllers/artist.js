'use strict'

let path = require('path');
let fs = require('fs');
let mongoosePaginate = require('mongoose-pagination');
let Artist = require('../models/artist');
let Album = require('../models/album');
let Song = require('../models/song');

function getArtist(req, res){
    let artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición.'});
        } else {
            if (!artist) {
                res.status(404).send({message: 'El artista no existe.'});
            } else {
                res.status(200).send({artist});
            }
        }
    });
}

function saveArtist(req,res){
    let artist = new Artist();

    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        } else {
            if (!artistStored) {
                res.status(400).send({message: 'El artista no ha sido guardado'});
            } else {
                res.status(500).send({artist: artistStored});
            }
        }
    });
}

function getArtists(req,res){
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    let itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err,artists,total){
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!artists) {
                res.status(404).send({message: 'No hay artista'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req,res){
    let artistId = req.params.id;
    let update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista.'});
        } else {
            if (!artistUpdated) {
                res.status(404).send({message: 'El artista no ha sido actualizado.'});
            } else {
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist
}