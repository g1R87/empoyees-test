const express = require('express')
const router = express.Router();
const employeesController = require('../../controllers/employeesControler');
// const verifyJWT = require('../../middleware/verifyJWT'); // adding jwt verification in the server.js file


//chaining req.methods in router
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)

router.route('/:id')
    .get(employeesController.getAnEmployee)
    .put(employeesController.updateAnEmployee)
    .delete(employeesController.deleteAnEmployee);


module.exports  = router;