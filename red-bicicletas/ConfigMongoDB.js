//Conexion a mongo DB Local
var mongoose = require('mongoose');
// var mongoDB ='mongodb://localhost/red-bicicletas';
//mongoose.connect('mongodb://localhost/red-bicicletas');
mongoose.connect('mongodb://localhost/red_bicicletas', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error de conexión:'));
// db.once('open', function() {
//    // console.log('Conectado a MongoDB');
//  // estamos conectados!
// });