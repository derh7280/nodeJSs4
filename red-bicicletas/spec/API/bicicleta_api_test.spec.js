
var Bicicleta = require('../../models/bicicleta_model');
var request = require('request');
var server = require('../../bin/www');
beforeEach( () => {Bicicleta.allBicis=[]}); //esto se ejecuta antes de cada test

describe('Bicicleta API', function(){

    describe('GET BICICLETAS /', function(){
        it('Status 200', function() {
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            Bicicleta.add(a); 
            request.get('http://localhost:5000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
            expect(Bicicleta.allBicis.length).toBe(1);
            expect(Bicicleta.allBicis[0]).toBe(a);
        });
    });

    describe('POST BICICLETAS /CREATE', function(){
        it('STATUS 200', function(done) {
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
                done();
            });
        });
    });

    describe('DELETE BICICLETAS /DELETE', function(){
        it('STATUS 204', function(done) {
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            var b = new Bicicleta(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
            Bicicleta.add(a);
            Bicicleta.add(b);
            var headers = {'content-type':'application/json'};
            // var a = '{ "id":100, "color":"Gris", "modelo":"Urbana", "lat":6.229688, "lng":-75.5870112 }';
            // var b = '{ "id":101, "color":"Gris", "modelo":"Urbana", "lat":6.229688, "lng":-75.5870112 }';
            request.delete({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/delete',
                body: '{"id":101}'
            }, function(error, response, body){
                expect(response.statusCode).toBe(204);
                expect(Bicicleta.allBicis.length).toBe(1);
                done();
            });
        });
    });

    describe('UPDATE BICICLETAS /UPDATE', function(){
        it('STATUS 200', function(done) {
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(100, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
            var b = new Bicicleta(101, 'Verde', 'Ruta', [6.208685, -75.5850117]);
            Bicicleta.add(a);
            Bicicleta.add(b);
            var headers = {'content-type':'application/json'};
            var upa = '{ "id":102, "color":"Rojo", "modelo":"Urbana", "lat":6.229658, "lng":-75.5970112 }';
            var upa2 = '{ "id":101, "color":"Gris", "modelo":"Pistera", "lat":6.229658, "lng":-75.5970112 }';

            var bici = Bicicleta.findById(101);
            if (bici){
                request.put({
                  headers: headers,
                  url: 'http://localhost:5000/api/bicicletas/update',
                  body: upa2
                  }, function(error, response, body){
                      expect(response.statusCode).toBe(200);
                      expect(Bicicleta.allBicis.length).toBe(2);
                      expect(Bicicleta.findById(101).id).toBe(101);
                      // expect(Bicicleta.findById(101).color).toBe("Gris");
                      // expect(Bicicleta.findById(101).modelo).toBe("Pistera");
                      done();
                });
            }
        });
    });

});





// describe("Bicicleta.allBicis", function() {
//     it("comienza vacia", function() {
//       expect(Bicicleta.allBicis.length).toBe(0);
//     });
//   });
//   // describe("Bicicleta.allBicis", () => {
//   //   it("comienza vacia", () => {
//   //     expect(Bicicleta.allBicis.length).toBe(0);
//   //   });
//   // });

//   describe("Bicicleta.add", function() {
//     it("agregamos una", function() {
//       expect(Bicicleta.allBicis.length).toBe(0);
//       var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
//       Bicicleta.add(a); 
//       expect(Bicicleta.allBicis.length).toBe(1);
//       expect(Bicicleta.allBicis[0]).toBe(a);
//     });
//   });

//   describe("Bicicleta.findById", function() {
//     it("debe devolver la bici con ID 1", function() {
//       expect(Bicicleta.allBicis.length).toBe(0);
//       var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
//       var b = new Bicicleta(2, 'Verde', 'Ruta', [6.208685, -75.5850117]);
//       Bicicleta.add(a);
//       Bicicleta.add(b);
//       var targetBici = Bicicleta.findById(1);
//       expect(targetBici.id).toBe(1);
//       expect(targetBici.color).toBe(a.color);
//       expect(targetBici.modelo).toBe(a.modelo);
//     });
//   });

//   describe("Bicicleta.removeById ", function() {
//     it("debe eliminar la bici con ID 2", function() {
//       expect(Bicicleta.allBicis.length).toBe(0);
//       var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
//       var b = new Bicicleta(2, 'Verde', 'Ruta', [6.208685, -75.5850117]);
//       Bicicleta.add(a);
//       Bicicleta.add(b);
//       var aBici = Bicicleta.findById(2);
//       var targetBici = Bicicleta.removeById(2);
//       expect(aBici.id).toBe(2);
//     });
//   });