var Bicicleta = require('../models/bicicleta_model');

exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis(function(err, bicicletas){
        res.render('bicicletas/index', {bicis: bicicletas});
    });
},

// exports.bicicleta_listByID = function(req, res){
//     var bicicleta = Bicicleta.findByCode (req.params.id);
    
//     res.render('bicicletas/view', {bicicleta});
// },

exports.bicicleta_listByID = function(req, res, next){
    Bicicleta.findById(req.params.id, function(err, bicicleta){
        res.render('bicicletas/view', {errors: {}, bicicleta: bicicleta});  
  });
},

exports.bicicleta_create_get = function(req, res, next){
    res.render('bicicletas/create');
},

// exports.bicicleta_create_post = function(req, res){
//     var bici = new Bicicleta(req.body.color, req.body.modelo);
//     bici.ubicacion = [req.body.lat, req.body.lng];
//     Bicicleta.add(bici);

//     res.redirect('/bicicletas');
// }

exports.bicicleta_create_post = function(req, res, next) {
    Bicicleta.create({color: req.body.color, modelo: req.body.modelo, ubicacion:[req.body.lat, req.body.lng]}, function (err, nuevaBicicleta) {
        if (err) {
            res.render('bicicletas/create', {errors: err.errors, bicicleta: new Bicicleta({color: req.body.color, modelo: req.body.modelo, ubicacion:[req.body.lat, req.body.lng]})});
        }else {
            res.redirect('/bicicletas');
        }
    })
},
 
exports.bicicleta_update_get = function(req, res, next){
    Bicicleta.findById(req.params.id, function(err, bicicleta) {
        res.render('bicicletas/update', {errors:{}, bicicleta:bicicleta});
    });
},

// exports.bicicleta_update_post = function(req, res){
//     var bici = Bicicleta.findById(req.params.id);
//     bici.id = req.body._id;
//     bici.color = req.body.color;
//     bici.modelo =  req.body.modelo;
//     bici.ubicacion = [req.body.lat, req.body.lng];

//     res.redirect('/bicicletas');
// },

exports.bicicleta_update_post = function(req, res, next){
    var update_values = {color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng]};
    //metodo de mongo que busca by id y actualiza 
    Bicicleta.findByIdAndUpdate(req.params.id, update_values, function(err, bicicleta) {
        if (err) {
            console.log(err);
            res.render('bicicletas/update', {errors: err.errors, bicicleta});
        }else {
            res.redirect('/bicicletas');
            return;
        }
    });
},

// exports.bicicleta_delete_post = function(req, res){
//     Bicicleta.removeById(req.body._id);

//     res.redirect('/bicicletas');
// }

exports.bicicleta_delete_post = function(req, res, next) {
    Bicicleta.findByIdAndDelete(req.body.id, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/bicicletas');
        }
    });
}