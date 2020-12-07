const { json } = require('express');
var Bicicleta = require('../../models/bicicleta_model');

exports.bicicleta_list = function(req, res){
       Bicicleta.find({} , function(err, bicicletas){
        res.status(200).json({
            bicicletas:bicicletas
        });
    });
};

exports.bicicleta_create = function(req, res){
    var bicicleta = new Bicicleta({color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng]});
    bicicleta.save(function(err){
      res.status(200).json(bicicleta);  
    });
};

exports.bicicleta_delete = function(req, res){
    var biciId = req.body._id;
    // Bicicleta.removeOne(function(err){
    //     res.status(204).send();
    // });
    Bicicleta.find({"_id" : biciId} , function(err, bicicletas){
        Bicicleta.removeById(biciId, function(err){
            res.status(200).json({
                bicicletas:bicicletas
            });
        });
    });
};
 
exports.bicicleta_update = function(req, res){
    var biciId = req.body._id;
    Bicicleta.find({"_id" : biciId} , function(err, bicicletas){
        // Bicicleta.updateById(biciId, req.body.code, req.body.color, req.body.modelo, [req.body.lat, req.body.lng] , function(err, bicicletas){
        //     res.status(200).json({
        //         bicicletas:bicicletas
        //     });
        //     // bicicletas.save(function(err){
        //     //     res.status(200).json({bicicletas:bicicletas});  
        //     // });
        // });
        Bicicleta.updateOne({"_id" : biciId}, [{ $set: { code: req.body.code, color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng]}}], function(err, bicicletas){
            res.status(200).json({bicicletas:bicicletas});  
        });
    });     
};

/*
//sin bd
const { json } = require('express');
var Bicicleta = require('../../models/bicicleta_model');

exports.bicicleta_list = function(req, res){
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
}

exports.bicicleta_create = function(req, res){
    var bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];

    Bicicleta.add(bici);
    res.status(200).json({
        bicicleta:bici
    });
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.id)
    res.status(204).send();
}

exports.bicicleta_update = function(req, res){
    var bici = Bicicleta.findById(req.body.id);
    if (bici){
        var bici2 = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
        bici2.ubicacion = [req.body.lat, req.body.lng];
        // Bicicleta.add(bici);
        res.status(200).json({
            bicicleta:bici2
        });
    }
    
}
*/