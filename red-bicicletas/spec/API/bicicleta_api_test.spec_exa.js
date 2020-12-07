var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta_model');
var server = require('../../bin/www');
var request = require('request');

//---------- ESQUEMA MONGOOSE ----------//

var base_url = 'http://localhost:3000/api/bicicletas';

describe("Bicicleta API", () => {
    var originalTimeout;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(function(done) {
        var mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error: '));
        db.once('open', function() {
            console.log('Estamos conectados a la base de datos de prueba');
            done();
        });
    });

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success) {
            if (err) console.log(err);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            mongoose.disconnect();   
            done();
        });
    });

    describe('GET BICICLETAS /', () => {
        it('Status 200', (done) => {
            request.get(base_url, function(error, response, body) {
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"id": 4, "color": "Azul", "modelo": "Canyon Aeroad", "lat": -25, "lng": -57}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe("Azul");
                expect(bici.ubicacion[0]).toBe(-25);
                expect(bici.ubicacion[1]).toBe(-57);
                done();
            });
        });
    });
});

describe ('DELETE BICICLETAS /delete', () => {
    it('Status 204', (done) => {
        var headers = {'content-type' : 'application/json'};
        var aBici = '{"id": 4, "color": "Azul", "modelo": "Canyon Aeroad", "lat": -25, "lng": -57}';

        request.delete({
            headers: headers,
            url: base_url + '/delete',
            body: aBici
        }, function(error, response, body) {
            expect(response.statusCode).toBe(204);
            Bicicleta.allBicis(function(err, doc) {
                expect(doc.length).toBe(0);
                done();
            });
        });
    });
});

describe ('UPDATE BICICLETAS /update', () => {
    it('Status 200', (done) => {
        var headers = {'content-type' : 'application/json'};
        var a = new Bicicleta({code: 10, color: 'Negro', modelo: 'Canyon Aeroad', ubicacion: [-25, -57]});
        Bicicleta.add (a, function() {			
            var headers = {'content-type' : 'application/json'};
            var bici = '{ "id": a.code, "color": "Amarillo", "modelo": "Canyon Aeroad", "lat":-25, "lng": -57}';
            request.put({
                headers: headers,
                url: base_url + '/update',
                body: bici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var foundBici = Bicicleta.findByCode(10, function(err, doc) {
                    expect(doc.code).toBe(10);
                    expect(doc.color).toBe(bici.color);
                    expect(doc.modelo).toBe(bici.modelo);
                    expect(doc.ubicacion[0]).toBe(bici.lat);
                    expect(doc.ubicacion[1]).toBe(bici.lng);
                    done();
                });
            });
        });
    });
});
//---------- FIN MONGOOSE ----------//

/*
describe('Bicicleta API', () => {
    
    describe('GET BICICLETAS /', () => {
        it('Status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1, 'Rojo', 'Scott plasma', [-25.276309, -57.624957]);
            Bicicleta.add(a);

            request.get('http://localhost:3000/api/bicicletas', function(error, response, body) {
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('STATUS 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"id": 4, "color": "Azul", "modelo": "Canyon Aeroad", "lat": -25.287252, "lng": -57.594487}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(4).color).toBe("Azul");
                done();
            });
        });
    });

});
*/