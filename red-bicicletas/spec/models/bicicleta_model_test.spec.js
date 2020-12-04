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