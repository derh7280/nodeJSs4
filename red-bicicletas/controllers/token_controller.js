var Usuario = require('../models/usuario_model');
var Token = require('../models/token');

module.exports = {
    confirmationGet: function(req, res, next){
        Token.findOne({token: req.params.token}, function(err, token){
            if(!token){
                return res.status(400).send({type:'no-verified', msg: 'No se encontro usuario con este token. Quizá haya expirado y debes solicitar otro'});
            }
            Usuario.findById(token._userId, function(err, usuario){
                if(!usuario){
                    return res.status(400).send({msg: 'No se encontro usuario con este token.'});
                }
                if(usuario.verificado){
                    return res.redirect('/usuarios');
                }
                usuario.verificado=true;
                usuario.save(function(err){
                    if(err){
                        return res.status(500).send({msg: err.message});
                    }
                    res.redirect('/');
                })
            })
        });
    }
}
