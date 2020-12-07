var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta_model');
var server = require('../../bin/www');
var request = require('request');

var base_URL = "http://localhost:5000/api/bicicletas";

describe('Bicicleta API', function(){
    var originalTimeout;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(function(){
        console.log("\n")
        console.log("TESTEANDO API...");
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        // var mongoDB = "mongodb://localhost/test-red-bicicletas-mongo";
        mongoose.connect('mongodb://localhost/test-red-bicicletas-mongo', {useNewUrlParser: true, useUnifiedTopology: true});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB error de conexión en test db'));
        db.once('open', function() {
          console.log('Estas conectado a la base de datos de test');
          //done();
        });   
    });

    //borrar toda la coleccion 
    afterEach(function(){ 
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            //done();
        });
    });

    describe('GET BICICLETAS /', function(){
        it('Status 200', function(done) {
            console.log("Test => GET All API Bicicletas");
            // expect(Bicicleta.allBicis.length).toBe(0);
            // var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            // Bicicleta.add(a); 
            request.get(base_URL, function(error, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(1);
                console.log(resuclelt.bicicletas);
                done();
            });
        });
    });

    describe('POST BICICLETAS /CREATE', function(){
        it('STATUS 200', function(done) {
            console.log("Test => POST CREATE API Bicicletas");
            var headers = {'content-type':'application/json'};
            var a = '{ "code":27, "color":"Gris", "modelo":"Urbana", "lat":6.229688, "lng":-75.5870112 }';
            request.post({
                headers: headers,
                url: base_URL + '/create',
                body: a
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.code).toBe(27);
                expect(bici.color).toBe("Gris");
                done();
            });
        });
    });

    describe('DELETE BICICLETAS /DELETE', function(){
        it('STATUS 204', function(done) {
            console.log("Test => DELETE API Bicicletas");
            expect(Bicicleta.allBicis.length).toBe(0);
            // var a = new Bicicleta(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            // var b = new Bicicleta(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
            // Bicicleta.add(a);
            // Bicicleta.add(b);
            // console.log(Bicicleta.allBicis);
            var a = Bicicleta.createInstance(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            var b = Bicicleta.createInstance(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
            Bicicleta.add(a, function(err, newBici){
                console.log(newBici);
                Bicicleta.add(b, function(err, newBici){
                    console.log(newBici);
                    var headers = {'content-type':'application/json'};
                    request.delete({
                        headers: headers,
                        url: 'http://localhost:5000/api/bicicletas/delete',
                        body: '{"id":101}'
                    }, function(error, response, body){
                        console.log("Bicicleta con code 101 eliminada");
                        expect(response.statusCode).toBe(204);
                        expect(Bicicleta.allBicis.length).toBe(1);
                        console.log(Bicicleta.allBicis);
                        done();
                    });
                });
            });   
        });
    });

    // describe('UPDATE BICICLETAS /UPDATE', function(){
    //     it('STATUS 200', function(done) {
    //         console.log("Test => PUT UPDATE API Bicicletas");
    //         expect(Bicicleta.allBicis.length).toBe(0);
    //         // var a = new Bicicleta(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
    //         // var b = new Bicicleta(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
    //         // Bicicleta.add(a);
    //         // Bicicleta.add(b);
    //         // console.log(Bicicleta.allBicis);
    //         var a = Bicicleta.createInstance(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
    //         var b = Bicicleta.createInstance(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
    //         Bicicleta.add(a, function(err, newBici){
    //             console.log(newBici);
    //             Bicicleta.add(b, function(err, newBici){
    //                 console.log(newBici);
    //                 var headers = {'content-type':'application/json'};
    //                 request.delete({
    //                     headers: headers,
    //                     url: 'http://localhost:5000/api/bicicletas/delete',
    //                     body: '{"id":101}'
    //                 }, function(error, response, body){
    //                     console.log("Bicicleta con code 101 eliminada");
    //                     expect(response.statusCode).toBe(204);
    //                     expect(Bicicleta.allBicis.length).toBe(1);
    //                     console.log(Bicicleta.allBicis);
    //                     done();
    //                 });
    //                 var upa2 = `"id":101, "color":"Gris", "modelo":"Pistera", "lat":6.229658, "lng":-75.5970112`;
    //                 var bici = Bicicleta.findById(101);
    //                 if (bici){
    //                     request.put({
    //                     headers: headers, 
    //                     url: 'http://localhost:5000/api/bicicletas/update',
    //                     body: '{ ' + upa2 +  '}'
    //                     }, function(error, response, body){
    //                         console.log("Bicicleta con id " + parseInt(id[1]) + " actualizada");
    //                         Bicicleta.updateById(parseInt(id[1]), color[1], modelo[1], parseFloat(lat[1]), parseFloat(lng[1]));
    //                         expect(response.statusCode).toBe(200);
    //                         expect(Bicicleta.allBicis.length).toBe(2);
    //                         expect(Bicicleta.findById(parseInt(id[1])).id).toBe(parseInt(id[1]));
    //                         console.log(Bicicleta.allBicis);
    //                         // expect(Bicicleta.findById(parseInt(id[1])).color).toBe("Gris");
    //                         // expect(Bicicleta.findById(parseInt(id[1])).modelo).toBe("Pistera");
    //                         done();
    //                     });
    //                 }
    //             });
    //         }); 
    //     });
    // });

});

/*
//sin BD
var Bicicleta = require('../../models/bicicleta_model');
var request = require('request');
var server = require('../../bin/www');

beforeEach( () => {console.log("\n")});
beforeEach( () => {console.log("TESTEANDO...")});
beforeEach( () => {Bicicleta.allBicis=[]}); //esto se ejecuta antes de cada test

describe('Bicicleta API', function(){

    describe('GET BICICLETAS /', function(){
        it('Status 200', function() {
            console.log("Test => GET All API Bicicletas");
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            Bicicleta.add(a); 
            request.get('http://localhost:5000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
            expect(Bicicleta.allBicis.length).toBe(1);
            expect(Bicicleta.allBicis[0]).toBe(a);
            console.log(Bicicleta.allBicis);
        });
    });

    describe('POST BICICLETAS /CREATE', function(){
        it('STATUS 200', function(done) {
            console.log("Test => POST CREATE API Bicicletas");
            var headers = {'content-type':'application/json'};
            var a = '{ "id":27, "color":"Gris", "modelo":"Urbana", "lat":6.229688, "lng":-75.5870112 }';
            request.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: a
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(27).id).toBe(27);
                expect(Bicicleta.findById(27).color).toBe("Gris");
                console.log(Bicicleta.allBicis);
                done();
            });
        });
    });

    describe('DELETE BICICLETAS /DELETE', function(){
        it('STATUS 204', function(done) {
            console.log("Test => DELETE API Bicicletas");
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            var b = new Bicicleta(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
            Bicicleta.add(a);
            Bicicleta.add(b);
            console.log(Bicicleta.allBicis);
            var headers = {'content-type':'application/json'};
            // var a = '{ "id":100, "color":"Gris", "modelo":"Urbana", "lat":6.229688, "lng":-75.5870112 }';
            // var b = '{ "id":101, "color":"Gris", "modelo":"Urbana", "lat":6.229688, "lng":-75.5870112 }';
            request.delete({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/delete',
                body: '{"id":100}'
            }, function(error, response, body){
                console.log("Bicicleta 100 eliminada");
                expect(response.statusCode).toBe(204);
                expect(Bicicleta.allBicis.length).toBe(1);
                console.log(Bicicleta.allBicis);
                done();
            });
        });
    });

    describe('UPDATE BICICLETAS /UPDATE', function(){
        it('STATUS 200', function(done) {
            console.log("Test => PUT UPDATE API Bicicletas");
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            var b = new Bicicleta(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
            Bicicleta.add(a);
            Bicicleta.add(b);
            console.log(Bicicleta.allBicis);
            var headers = {'content-type':'application/json'};
            var upa2 = `"id":101, "color":"Gris", "modelo":"Pistera", "lat":6.229658, "lng":-75.5970112`;
            var variables = upa2.split(",");
            var bici = Bicicleta.findById(101);
            var id = variables[0].split(":");
            var color = variables[1].split(":");
            var modelo = variables[2].split(":");
            var lat = variables[3].split(":");
            var lng = variables[4].split(":");
            if (bici){
                request.put({
                  headers: headers, 
                  url: 'http://localhost:5000/api/bicicletas/update',
                  body: '{ ' + upa2 +  '}'
                  }, function(error, response, body){
                      console.log("Bicicleta con id " + parseInt(id[1]) + " actualizada");
                      Bicicleta.updateById(parseInt(id[1]), color[1], modelo[1], parseFloat(lat[1]), parseFloat(lng[1]));
                      expect(response.statusCode).toBe(200);
                      expect(Bicicleta.allBicis.length).toBe(2);
                      expect(Bicicleta.findById(parseInt(id[1])).id).toBe(parseInt(id[1]));
                      console.log(Bicicleta.allBicis);
                      // expect(Bicicleta.findById(parseInt(id[1])).color).toBe("Gris");
                      // expect(Bicicleta.findById(parseInt(id[1])).modelo).toBe("Pistera");
                      done();
                });
            }
        });
    });

});
*/