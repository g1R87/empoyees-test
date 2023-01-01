const data = {
    employees : require('../model/employees.json'),
    setEmployees: function (data) {this.employees = data}
};


const getAllEmployees = (req,res) => {
    res.json(data.employees)
  }

const getAnEmployee = (req,res) => {
    const emp = data.employees.find(ele => ele.id === parseInt(req.body.id))
    if(!emp){
        res.status(400).json({"message": "employee not found"})
    }
    res.json(emp);
  }

const createNewEmployee = (req,res) => {
    const newEmp = {
        id: req.body.id || data.employees[data.employees.length - 1].id + 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if(!newEmp.firstname || !newEmp.lastname){
        return res.status(400).json({"message": "The first/last Names are required"})
    }

    data.setEmployees([...data.employees, newEmp]);
    res.status(201).json(data.employees);
  }

const updateAnEmployee = (req,res) => {
    const emp = data.employees.find(element => element.id === parseInt(req.params.id) );
    if(!emp){
        return res.status(400).json({"message": `Employee ID ${req.params.id} not found.`})
    }
    if(req.body.firstname) emp.firstname = req.body.firstname;
    if(req.body.lastname) emp.lastname = req.body.lastname;
    const filteredArray = data.employees.filter(ele => ele.id !== parseInt(req.params.id))
    const unsortedArray = [...filteredArray, emp];
    data.setEmployees(unsortedArray.sort((a,b)=> a.id >b.id? 1: a.id <b.id? -1:0))
    res.json(data.employees);

  }

const deleteAnEmployee = (req,res) => {
    const emp = data.employees.find(element => element.id === parseInt(req.params.id) );
    if(!emp){
        return res.status(400).json({"message": `Employee ID ${req.params.id} not found.`})
    }
    const filteredArray = data.employees.filter(ele => ele.id !== parseInt(req.params.id));
    data.setEmployees([...filteredArray])
    res.json(data.employees);
  }

module.exports = {
    getAllEmployees,
    getAnEmployee,
    createNewEmployee,
    updateAnEmployee,
    deleteAnEmployee
}