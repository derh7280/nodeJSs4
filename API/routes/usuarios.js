var express = require('express');
var router = express.Router();
var usuarioController = require ('../controller/usuarioControllerAPI');

router.get('/', usuarioController.usuarios_list);
router.post('/create', usuarioController.usuarios_create);
router.delete('/reservar', usuarioController.usuario_reservar);

module.exports = router; 