var Usuario = require('../models/usuario_model');

// exports.usuario_list = function(req, res, next){
//     res.render('usuarios/index', {usuarios: usuario.allBicis});
// }

exports.usuario_list = function(req, res, next){
    Usuario.find({}, function(err, usuarios){
        res.render('usuarios/index', {usuarios: usuarios});
    });
}

// exports.usuario_listByID = function(req, res){
//     var bici = usuario.findById(req.params.id);
    
//     res.render('usuarios/view', {usuario});
// }

exports.usuario_create_get = function(req, res, next){
    res.render('usuarios/create', {errors: {}, usuario: new Usuario()});
}

exports.usuario_create_post = function(req, res, next){
    if (req.body.password != req.boy.confirm_password){
        res.render('usuarios/creat', { errors: {confirm_password:{ message: 'No coinciden las claves'}}});
        return;
    }
    // var usuario= new Usuario(req.body.id, req.body.color, req.body.modelo);
    // bici.ubicacion = [req.body.lat, req.body.lng];
    // usuario.add(usuario);
    Usuario.create({nombre: req.body.nombre, email: req.body.email, password: req.body.password, confirm_password: req.body.confirm_password});
    res.redirect('/usuarios');
}

exports.usuario_update_get = function(req, res, next){
    Usuario.findById(req.params.id, function(err, usuario){
          res.render('usuarios/update', {errors: {}, usuario: usuario});  
    });
}

exports.usuario_update_post = function(req, res, next){
    var update_values = {nombre: req.body.nombre};
    Usuario.findByIdUpdate(req.params.id, update_values);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo =  req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.redirect('/usuarios');
}

exports.usuario_delete_post = function(req, res){
    usuario.removeById(req.body.id);

    res.redirect('/usuarios');
}
