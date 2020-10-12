var express = require('express');
var route = express.Router();
var controller = require('../controller/user_controller')

route.post('/',controller.postRegister,controller.login)
route.get('/',controller.view)




module.exports = route;
