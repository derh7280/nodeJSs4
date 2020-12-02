var express = require('express');
var router = express.Router();
var bicicletaController = require ('../controller/bicicletaControllerAPI');

router.get('/', bicicletaController.bicicleta_list);
router.post('/create', bicicletaController.bicicleta_create);
router.delete('/delete', bicicletaController.bicicleta_delete);
router.put('/update', bicicletaController.bicicleta_update);
// router.get('/:id/view', bicicletaController.bicicleta_listByID);
// router.get('/create', bicicletaController.bicicleta_create_get);

// router.get('/:id/update', bicicletaController.bicicleta_update_get);
// router.post('/:id/update', bicicletaController.bicicleta_update_post);


module.exports = router; 