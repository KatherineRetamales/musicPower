'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'clave_secreta_curso';

console.log('jwt-------------------------------------',jwt);

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');
  
    try{
        var payload = jwt.decode(token, secret);
        console.log('payload----------------------',payload);
        
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'El token ha expirado'});
        }
    }catch(ex){
        console.log(ex);
        return res.status(404).send({message: 'Token no valido'});
    }
  
    req.user = payload;

    console.log('respuesta---------------------',req.user);
    
    
    next();
};