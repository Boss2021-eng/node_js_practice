employees = [
  { id: 1, firstName: 'Daniel', lastName: 'Isreal' },
  { id: 2, firstName: 'John', lastName: 'Doe' },
];
// data = {
//   employees: employees,
//   setEmployees: (value) => {return this.employees = value}
// }
setEmployees = (data) => {
  return (employees = data);
};

// setEmployees({id:4, firstName: 'Damilola', lastName: 'Olatayo' })
// console.log(data)

const createEmployee = (firstName, lastName) => {
  const id = employees[employees.length - 1].id + 1 || 1;
  // console.log(firstName, lastName)
  const newEmployee = { id, firstName, lastName };
  setEmployees([...employees, newEmployee]);
  return employees;
};
createEmployee('David', 'Stone');

const updateEmployee = (id, first, last) => {
  const newEmployees = employees.map((item) =>
    item.id === id ? { ...item, firstName: first, lastName: last } : item
  );
  setEmployees(newEmployees);
  return employees;
};
updateEmployee(3, 'Mary', 'Stone');

const deleteEmployee = (id) => {
  const newEmployees = employees.filter((item) => item.id !== id);
  setEmployees(newEmployees);
  return employees;
};

deleteEmployee(3);

console.log(employees);

console.log(employees);
