var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var bicicletaSchema = new mongoose.Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type:'2dsphere', sparse: true } //index...indexando en dato geografico PDSPHERE 
    }
});

//CREAR BICICLETA POR INSTANCIA
bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = function(){
    return 'code: ' + this.code + ' color: '+ this.color;
}

//CONSULTAR TODAS LAS BICICLETA
bicicletaSchema.statics.allBicis = function(cb){
    return this.find({}, cb);//filtro de json vacio
}

//AGREGAR BICICLETA
bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici, cb);
}

//CONSULTAR BICICLETA BY CODE
bicicletaSchema.statics.findByCode = function(aCode, cb){
    return this.findOne({code: aCode}, cb);
}

bicicletaSchema.statics.findById = function(aId, cb){
    return this.find({"_id" : ObjectId(aId)}, cb);
}

//ELIMINAR BICICLETA BY CODE
bicicletaSchema.statics.removeByCode = function(aCode, cb){
    return this.deleteOne({code: aCode}, cb);
    //return this.deleteOne( { "_id" : ObjectId(aCode) }, cb );
}

bicicletaSchema.statics.removeById = function(aId, cb){
    return this.deleteOne({"_id" : aId}, cb );
}

bicicletaSchema.statics.updateById = function(aId, code, color, modelo, ubicacion){
    // try {
    //     db.restaurant.updateOne(
    //        { "name" : "Central Perk Cafe" },
    //        { $set: { "violations" : 3 } }
    //     );
    //  } catch (e) {
    //     print(e);
    //  }

   return this.updateOne(
        {"_id" : aId},
        [
            {
                $set: { code: code, color: color, modelo: modelo, ubicacion: ubicacion }
            }
        ]
     );
}

module.exports = mongoose.model('Bicicleta', bicicletaSchema);


// var Bicicleta = function(id, color, modelo, ubicacion){
//     this.id=id;
//     this.color=color;
//     this.modelo=modelo;
//     this.ubicacion=ubicacion;
// } 

// Bicicleta.prototype.toString = function () {
//     return 'id: ' + this.id + ' color: '+ this.color;
// }

// Bicicleta.allBicis = [];
// Bicicleta.add = function(aBici){
//     Bicicleta.allBicis.push(aBici);
// }

// Bicicleta.findById = function(aBiciId){
//     var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId);
//     if (aBici)
//         return aBici;
//     else
//         throw new Error(`No existe bicicleta con el id ${aBiciId}`);
// }
 
// Bicicleta.removeById = function(aBiciId){
//     // var aBici = Bicicleta.findById(aBiciId);
//     for(var i = 0; i< Bicicleta.allBicis.length; i++)
//     {
//         if (Bicicleta.allBicis[i].id){
//             Bicicleta.allBicis.splice(i,1);
//             break;
//         }
//     }
// } 

// Bicicleta.updateById = function(aBiciId, color, modelo, lat, lng){
//     // var aBici = Bicicleta.findById(aBiciId);
//     for(var i = 0; i< Bicicleta.allBicis.length; i++)
//     {
//         if (Bicicleta.allBicis[i].id===aBiciId){
//             Bicicleta.allBicis[i].id=aBiciId;
//             Bicicleta.allBicis[i].color=color;
//             Bicicleta.allBicis[i].modelo=modelo;
//             Bicicleta.allBicis[i].ubicacion=[lat,lng];
//             break;
//         }
//     }
// }

// // var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
// // var b = new Bicicleta(2, 'Verde', 'Ruta', [6.208685, -75.5850117]);

// // Bicicleta.add(a);
// // Bicicleta.add(b);

// module.exports = Bicicleta;