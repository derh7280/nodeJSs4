var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta_model');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe("Testing Usuarios", function() {
    console.log("\n")
    console.log("TESTEANDO USUARIOS...");
    var originalTimeout;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(function(){
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        // var mongoDB = "mongodb://localhost/test-red-bicicletas-mongo";
        mongoose.connect('mongodb://localhost/red_bicicletas', {useNewUrlParser: true, useUnifiedTopology: true});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB error de conexión en test db'));
        db.once('open', function() {
            console.log('Estas conectado a la base de datos de test');
            //done();
        });   
    });

    //borrar toda la coleccion 
    afterEach(function(){ 
        Reserva.deleteMany({}, function(err, success){
            if(err) console.log(err);
            Usuario.deleteMany({} ,function(err, success){
                if(err) console.log(err);
                Usuario.deleteMany({} ,function(err, success){
                    if(err) console.log(err);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                    //done();  
                });
            });
        });
    });

    describe('Cuando un usuario reserva una bici', function(){
       it('desde existir la reserva', function(done){
            console.log("\n");
            console.log("TEST => Cuando un usuario reserva una bicicleta");
            const usuario = new Usuario({nombre: 'Duhan'});
            usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: "Rojo", modelo: "Todo terreno" });
            bicicleta.save();

            var today = new Date();
            var tomorrow = new Date(); 
            tomorrow.setDate(today.getDate()+1);
            usuario.reservar(bicicleta.id, today, tomorrow, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                })
            });
        }); 
    });

});