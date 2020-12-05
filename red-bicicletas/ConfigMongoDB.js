//Conexion a mongo DB Local
var mongoose = require('mongoose');
// var mongoDB ='mongodb://localhost/red-bicicletas';
//mongoose.connect('mongodb://localhost/red-bicicletas');
mongoose.connect('mongodb://localhost/red-bicicletas', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error de conexión:'));
db.once('open', function() {
 // estamos conectados!
}); 

//ODM Mongoose.  en Mongoose todo modelo deriva de la clase Schema
//Creamos un esquema con 2 propiedades
var ciudadanoSchema = new mongoose.Schema({
    nombre: String,
    edad: Number
}); 

//modelo asociado.  Un modelo es una clase con la cual construimos los documentos. 
//en este caso cada documento sera un ciudadano
var Ciudadano = mongoose.model('Ciudadano', ciudadanoSchema);

//creando documento
var unCiudadano = new Ciudadano({ nombre: 'Pedro', edad: 21 });
console.log(unCiudadano.nombre); // 'Pedro'

//Agreguemos algún comportamiento como 'saludar'. 
ciudadanoSchema.methods.saludar = function () {
    var saludo = this.nombre
    ? "Hola, mi nombre es " + this.name
    : "Hola, no tengo nombre";
    console.log(saludo);
}

// var Ciudadano = mongoose.model('Ciudadano', ciudadanoSchema); 

// var unCiudadano = new Ciudadano({ nombre: 'Pedro', edad: 21 });
// unCiudadano.saludar(); // "Hola, mi nombre es Pedro"

// unCiudadano.save(function (err, unCiudadano) {
//     if (err) return console.error(err);
//         unCiudadano.saludar();
// });

// //Obtener todos los ciudadanos de la base de datos   
// Ciudadano.find(function (err, ciudadanos) {
//     if (err) return console.error(err);
//     console.log(ciudadanos);
// })
// //Podemos aplicar filtros por nombre
// Ciudadano.find({ nombre: /^Pedro/ }, callback); //Eso realizará una búsqueda en la colección de Ciudadanos por los documentos con nombre que empiece con “Pedro” y devolverá una colección de ciudadanos al callback. 
