var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta_model');

describe("Testing Bicicletas", function() {
  console.log("\n")
  console.log("TESTEANDO BICICLETAS...");
  var originalTimeout;
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeEach(function(done){
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      mongoose.connect('mongodb://localhost/red_bicicletas', {useNewUrlParser: true, useUnifiedTopology: true});
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB error de conexión en test db'));
      db.once('open', function() {
        console.log('Estas conectado a la base de datos de test');
        done();
      }); 
  });

  //borrar toda la coleccion 
  afterEach(function(done){ 
    Bicicleta.deleteMany({}, function(err, success){
        if(err) console.log(err);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        mongoose.disconnect();        
        done();
    });
  });
    
  describe("Bicicleta.createInstance", function() {//ok
      it("Crea una instancia de Bicicleta", function(done){
          var bici = Bicicleta.createInstance(1, "Rojo", "Todo terreno", [-34.5, -54.1]);
          console.log("\n");
          console.log("TEST => Crear una instancia de Bicicleta");
          console.log(bici);
          expect(bici.code).toBe(1);
          expect(bici.color).toBe("Rojo");      
          expect(bici.modelo).toBe("Todo terreno");      
          expect(bici.ubicacion[0]).toBe(-34.5);     
          expect(bici.ubicacion[1]).toBe(-54.1);
          done();
      });
  })

  // describe("Bicicleta.allBicis", function() {
  //     it("lista bicicletas", function(done){
  //         console.log("\n");
  //         console.log("TEST => Listar Bicicleta, comienza vacia e internamente se crean 2 bicicletas")
  //         var bici1 = Bicicleta.createInstance(1, "Rojo", "Todo terreno", [-34.5, -54.1]);
  //         var bici2 = Bicicleta.createInstance(2, "Verde", "Urbana", [-38.4, -45.8]);
  //         expect(bici1.code).toBe(1);
  //         expect(bici2.code).toBe(2);
  //         Bicicleta.allBicis(function(err, bicis){
  //             if(err) console.log(err);  
  //             // expect(bicis.lenght).toBe(2);
  //             console.log(bicis);
  //             done();
  //         });
  //     });
  // });
  describe("Bicicleta.allBicis", function() {//ok
    it("lista bicicletas", function(done){
        console.log("\n");
        console.log("TEST => Listar Bicicleta, comienza vacia e internamente se crean 2 bicicletas")
        var bici1 = new Bicicleta({ code : 1, color : "Blanco", modelo : "Turismo", ubicacion : [-34.5, -54.1] });
        Bicicleta.add(bici1, function(err, newBici){
            if(err) console.log(err);
            var bici2 = new Bicicleta({ code : 2, color : "Rojo", modelo : "Urbana", ubicacion : [-34.5, -54.1] });
            Bicicleta.add(bici2, function(err, newBici){
                if(err) console.log(err);
                Bicicleta.allBicis(function(err, bicis){
                  // expect(bicis.length).toBe(2);
                  expect(bicis[0].code).toBe(bici1.code);
                  expect(bicis[1].code).toBe(bici2.code);
                  console.log(bicis);
                  done();
                })
            }); 
        })
    });
});

  describe("Bicicleta.add", function() {//ok
      it("Agrega solo una Bicicleta", function(done){
          var bici = new Bicicleta({ code : 100, color : "Blanco", modelo : "Turismo", ubicacion : [-34.5, -54.1] });
          console.log("\n");
          console.log("TEST => Agrega solo una Bicicleta");
          //console.log(bici);
          Bicicleta.add(bici, function(err, newBici){
            if(err) console.log(err);
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(1);
                expect(bicis[0].code).toBe(100);
                console.log(bicis);
                done();
            })
          })
      });
  });

  describe("Bicicleta.findByCode", function() {//ok
      it("Debe devolver la bicicleta con code 101", function(done){
          console.log("\n");
          console.log("TEST => Consulta una Bicicleta por code");
          Bicicleta.allBicis(function(err, bicis){
              //expect(bicis.lenght).toBe(0);
              var bici = new Bicicleta({ code : 100, color : "Blanco", modelo : "Turismo", ubicacion : [-34.5, -54.1] });
              var bici2 = new Bicicleta({ code : 101, color : "Rojo", modelo : "Urbana", ubicacion : [-35.7, -53.5] });
              Bicicleta.add(bici, function(err, newBici){
                  if(err) console.log(err);
                  Bicicleta.add(bici2, function(err, newBici){
                      if(err) console.log(err);  
                      Bicicleta.allBicis(function(err, bicis){
                          //expect(bicis.lenght).toBe(0);
                          console.log("listado bicicletas, comienza vacia e internamente se crean 2 bicicletas");
                          console.log(bicis);
                          console.log("Consulta bicicleta con code " + bici2.code);
                          Bicicleta.findByCode(bici2.code, function(err, targetBici){
                              expect(targetBici.code).toBe(bici2.code);
                              expect(targetBici.color).toBe(bici2.color);
                              expect(targetBici.modelo).toBe(bici2.modelo);
                              console.log(targetBici);
                              done();
                          });
                      }); 
                  });
              });
          });     
      });
  });  


});

/*
//SIN BD
var Bicicleta = require('../../models/bicicleta_model');
beforeEach( () => {Bicicleta.allBicis=[]}); //esto se ejecuta antes de cada test
describe("Bicicleta.allBicis", function() {
    it("comienza vacia", function() {
      expect(Bicicleta.allBicis.length).toBe(0);
    });
  });
  // describe("Bicicleta.allBicis", () => {
  //   it("comienza vacia", () => {
  //     expect(Bicicleta.allBicis.length).toBe(0);
  //   });
  // });

  describe("Bicicleta.add", function() {
    it("agregamos una", function() {
      expect(Bicicleta.allBicis.length).toBe(0);
      var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
      Bicicleta.add(a);
      expect(Bicicleta.allBicis.length).toBe(1);
      expect(Bicicleta.allBicis[0]).toBe(a);
    });
  });

  describe("Bicicleta.findById", function() {
    it("debe devolver la bici con ID 1", function() {
      expect(Bicicleta.allBicis.length).toBe(0);
      var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
      var b = new Bicicleta(2, 'Verde', 'Ruta', [6.208685, -75.5850117]);
      Bicicleta.add(a);
      Bicicleta.add(b);
      var targetBici = Bicicleta.findById(1);
      expect(targetBici.id).toBe(1);
      expect(targetBici.color).toBe(a.color);
      expect(targetBici.modelo).toBe(a.modelo);
    });
  });

  describe("Bicicleta.removeById ", function() {
    it("debe eliminar la bici con ID 2", function() {
      expect(Bicicleta.allBicis.length).toBe(0);
      var a = new Bicicleta(1, 'Rojo', 'Urbana', [6.229688, -75.5870112]);
      var b = new Bicicleta(2, 'Verde', 'Ruta', [6.208685, -75.5850117]);
      Bicicleta.add(a);
      Bicicleta.add(b);
      var aBici = Bicicleta.findById(2);
      var targetBici = Bicicleta.removeById(2);
      expect(aBici.id).toBe(2);
    });
    
  });
  */