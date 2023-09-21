const Employee = require('../model/Employees');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(201).json({ message: 'No employees found' });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: 'first name and last name are required. ' });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: 'ID Parameter is required ' });
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee)
    return res
      .status(204)
      .json({ message: `No Employee matches ID ${req.body.id}.` });

  if (req?.body?.firstname) employee.firstname = req.body.firstname;
  if (req?.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();

  res.json(employee);
};

const deleteEmployee = (req, res) => {
  const id = parseInt(req.body.id);
  const employee = data.employees.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(400).json({ message: `Employee ID: ${id} not found` });
  }

  const filteredEmployees = data.employees.filter((emp) => emp.id !== id);
  setEmployees(filteredEmployees);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (employee) => employee.id === parseInt(req.params.id)
  );

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID: ${req.params.id} not found` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
