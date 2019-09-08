'user strict'

let fs = require('fs');
let path = require('path');
let bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');
let jwt = require('../services/jwt');


function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del api'
    });
}

function saveUser(req, res){
    let user = new User();

    let params = req.body;
    console.log('params--------------------------',params);
    
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null , null, function(err, hash){
            user.password = hash;
            
            if(user.name != null && user.surname != null && user.email != null){
                //Guardar el usuario
                user.save((err,userStored) => {
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Rellena todos los campos'});
            }
        })
    }else{
        res.status(200).send({message: 'Indroduce la contraseña'});
    }
}

function loginUser(req, res){
    let params = req.body;
    let email = params.email;
    let password = params.password;
    console.log('contraseña------------',password);
    
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res,status(500).send({message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devolvera los datos del usuario logueado
                        if(params.gethash){
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error al actualizar el usuario'});
        } else {
            if (!userUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    })
}

function uploadImage(req,res){
    let userId = req.params.id;
    let file_name = 'No subido...';

    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, { image: file_name},(err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                } else {
                    res.status(200).send({user: userUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Extension del archivo no valido'});
        }
    } else {
        res.status(200).send({message: 'No ha subido ninguna imagen...'});
    }
}

function getImagenFile(req,res){
    let imageFile = req.params.imageFile;
    let path_file = './uploads/users/'+ imageFile;
    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'no existe la imagen.....'});
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImagenFile
};