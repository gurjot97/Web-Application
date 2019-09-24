
//declaring variables for using specific module(s)
const Sequelize = require('sequelize');

//setting up the database by inputting name, username, password, and host information for Postgres
var sequelize = new Sequelize('d7navaq0crj9gs', 'isormuorrawsah', 'f7ca0374ffa2bcb08a9714db6adac18e73814eab929873ad3eb5b6f361ede7ea', {
    host: 'ec2-107-20-243-220.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});


/*** DELETED ***
//declaring "employees" array
var employees = [];
*/

/*** DELETED ***
//declaring "departments" array
var departments = [];
*/

//created a data model for Employee
const Employee = sequelize.define("Employee", {
    employeeNum : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true  
    },
    firstName : Sequelize.STRING,
    lastName : Sequelize.STRING,
    email : Sequelize.STRING,
    SSN : Sequelize.STRING,
    addressStreet : Sequelize.STRING,
    addressCity : Sequelize.STRING,
    addressState : Sequelize.STRING,
    addressPostal : Sequelize.STRING,
    maritalStatus : Sequelize.STRING,
    isManager : Sequelize.BOOLEAN,
    employeeManagerNum : Sequelize.INTEGER,
    status : Sequelize.STRING,
    department : Sequelize.INTEGER,
    hireDate : Sequelize.STRING
});

//created a data model for Department
const Department = sequelize.define("Department", {
    departmentId : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName : Sequelize.STRING
});

//This function will read the contents of the data JSON file
module.exports.initialize = function() {

    /*** DELETED ***
    return new Promise(function(resolve, reject) {

        const fs = require('fs');

        //checks if the data files are accessible to read
        try {
            //reading employees.json file
            fs.readFile('./data/employees.json', 'utf8', (err, data) => {
                if (err) throw err;
                employees = JSON.parse(data);

                //reading departments.json file
                fs.readFile('./data/departments.json', 'utf8', (err, data) => {
                    if(err) throw err;
                    departments = JSON.parse(data);

                    resolve();
                    return;
                });
            });
        }
        catch(ex) {
            reject("unable to read file");
            return;
        }
    }); 
*/

    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then( () => {
            return resolve();
        })
        .catch( () => {
            return reject("unable to sync the database");
        });
    });
}

//This function will provide the full array of "employee" objects using the resolve method of the returned promise
module.exports.getAllEmployees = function() {

    /*** DELETED ***
    return new Promise(function(resolve, reject) {

        if(employees.length == 0) {
            reject("no results returned");
            return;
        }
        else {
            resolve(employees);
            return;
        }
    });  
    */

    return new Promise(function (resolve, reject) {
        
        Employee.findAll()
        .then( (data) => {
            return resolve(data);
        })
        .catch( () => {
            return reject("no results returned");
        });
    });
}

//This function will provide an array of "employee" objects whose isManager property is true using the resolve method of the returned promise
module.exports.getManagers = function() {

    /*** DELETED ***
    return new Promise(function(resolve, reject) {

        if(employees.length == 0) {
            reject("no results returned");
            return;
        }
        else {
            let managers = [];

            for(let i = 0; i < employees.length; ++i) {

                if(employees[i].isManager == true) {
                    managers.push(employees[i]);
                }
            }

            resolve(managers);
            return;
        }
    });  
    */

    return new Promise(function (resolve, reject) {
        reject();
    });
}

//This function will provide the full array of "departments" objects using the resolve method of the returned promise
module.exports.getDepartments = function() {

    /*** DELETED ***
    return new Promise(function(resolve, reject) {

        if(departments.length == 0) {
            reject("no results returned");
            return;
        }
        else {
            resolve(departments);
            return;
        }
    });  
    */

    return new Promise(function (resolve, reject) {
        
        Department.findAll()
        .then( (data) => {
            return resolve(data);
        })
        .catch( () => {
            return reject("no results returned");
        });
    });
}

//This function will add employee into the employees array
module.exports.addEmployee = (employeeData) => {

    /*** DELETED ***
    return new Promise(function(resolve, reject) {

        if(employeeData.isManager === undefined) {
            employeeData.isManager = false;
        }
        else {
            employeeData.isManager = true;
        }

        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);

        resolve();
        return;
    });
    */

    return new Promise(function (resolve, reject) {
        
        employeeData.isManager = (employeeData.isManager) ? true : false;
        
        for(const data in employeeData) {
            
            if(employeeData[data] === "") {
                employeeData[data] = null;
            } 
        }

        Employee.create(employeeData)
        .then( () => {
            return resolve();
        })
        .catch( () => {
            return reject("unable to create employee");
        });
    });
}

//This function returns employee by status
module.exports.getEmployeesByStatus = (status) => {

    /*** DELETED ***
    var statusEmployees = [];

    return new Promise( (resolve, reject) => {

        for(let i = 0; i < employees.length; ++i) {

            if(status == employees[i].status) {
                statusEmployees.push(employees[i]);
            }
        }

        if(statusEmployees.length == 0) {
            reject("no results returned");
            return;
        }
        else {
            resolve(statusEmployees);
            return;
        }
    });
    */

    return new Promise(function (resolve, reject) {
        
        Employee.findAll({ 
            where : { 
                status : status 
            } 
        })
        .then( (data) => {
            return resolve(data);
        })
        .catch( () => {
            return reject("no results returned");
        });
    });
}

//This function will get employee by department
module.exports.getEmployeesByDepartment = (department) => {

    /*** DELETED ***
    var departmentEmployees = [];

    return new Promise( (resolve, reject) => {

        for(let i = 0; i < employees.length; ++i) {
            
            if(department == employees[i].department) {
                departmentEmployees.push(employees[i]);
            }
        }

        if(departmentEmployees.length == 0) {
            reject("no results returned");
            return;
        }
        else {
            resolve(departmentEmployees);
            return;
        }
    });
    */

    return new Promise(function (resolve, reject) {
        
        Employee.findAll({
            where : {
                department : department
            }
        })
        .then( (data) => {
            return resolve(data);
        })
        .catch( () => {
            return reject("no results returned");
        })
    });
} 

//This function will get employee by manager
module.exports.getEmployeesByManager = (manager) => {

    /*** DELETED ***
    var employeeManagers = [];

    return new Promise( (resolve, reject) => {

        for(let i = 0; i < employees.length; ++i) {

            if(manager == employees[i].employeeManagerNum) {
                employeeManagers.push(employees[i]);
            }
        }

        if(employeeManagers.length == 0) {
            reject("no results returned");
            return;
        }
        else {
            resolve(employeeManagers);
            return;
        }
    });
    */

    return new Promise(function (resolve, reject) {
        
        Employee.findAll({
            where : {
                employeeManagerNum : manager
            }
        })
        .then( (data) => {
            return resolve(data);
        })
        .catch( () => {
            return reject("no results returned");
        });
    });
}

//This function will get employee by num
module.exports.getEmployeeByNum = (num) => {

    /*** DELETED ***
    return new Promise( (resolve, reject) => {

        for(let i = 0; i < employees.length; ++i) {

            if(num == employees[i].employeeNum) {
                return resolve(employees[i]);
            }
        }

        return reject("no results returned");
    });
    */

    return new Promise(function (resolve, reject) {
        
        Employee.findAll({
            where : {
                employeeNum : num
            }
        })
        .then( (data) => {
            return resolve(data[0]);
        })
        .catch( () => {
            return reject("no results returned");
        });
    });
}

//This function will update employee 
module.exports.updateEmployee = (employeeData) => {

    /*** DELETED ***
    return new Promise( (resolve, reject) => {

        for(let i = 0; i < employees.length; ++i) {

            if(employees[i].employeeNum == employeeData.employeeNum) {

                employees[i].firstName = employeeData.firstName;
                employees[i].lastName = employeeData.lastName; 
                employees[i].email = employeeData.email;
                employees[i].SSN = employeeData.SSN;

                employees[i].addressStreet = employeeData.addressStreet;
                employees[i].addressCity = employeeData.addressCity;
                employees[i].addressState = employeeData.addressState;
                employees[i].addressPostal = employeeData.addressPostal;

                employees[i].addressPostal = employeeData.addressPostal;

                if(employeeData.isManager === undefined) {
                    employees[i].isManager = false;
                }
                else {
                    employees[i].isManager = true;
                }

                employees[i].employeeManagerNum = employeeData.employeeManagerNum;
                employees[i].status = employeeData.status;
                employees[i].department = employeeData.department;
                employees[i].hireDate = employeeData.hireDate;

                return resolve();
            }
        }

        return reject("Employee not found");
    });
    */

    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for(const data in employeeData) {
            
            if(employeeData[data] === "") {
                employeeData[data] = null;
            } 
        }

        Employee.update(employeeData, {
            where : { 
                employeeNum : employeeData.employeeNum
            }
        })
        .then( () => {
            return resolve(Employee);
        })
        .catch( () => {
            return reject("unable to update employee");
        });
    });
}

//This function will add department
module.exports.addDepartment = (departmentData) => {

    return new Promise( (resolve, reject) => {

        for(const data in departmentData) {

            if(departmentData[data] == "") {
                departmentData[data] = null;        
            }
        }

        Department.create(departmentData)
        .then( () => {
            return resolve();
        })
        .catch( () => {
            return reject("unable to create department");
        });
    });
}

//This function will update department
module.exports.updateDepartment = (departmentData) => {

    return new Promise( (resolve, reject) => {

        for(const data in departmentData) {

            if(departmentData[data] == "") {
                departmentData[data] = null;
            }
        }

        Department.update(departmentData, {
            where : {
                departmentId : departmentData.departmentId
            }
        })
        .then( () => {
            resolve(Department);
        })
        .catch( () => {
            reject("unable to update department");
        });
    });
}

//This function will get department by id
module.exports.getDepartmentById = (id) => {

    return new Promise( (resolve, reject) => {

        Department.findAll({
            where : {
                departmentId : id
            }
        })
        .then( (data) => {
            resolve(data[0]);
        })
        .catch( () => {
            reject("no results returned");
        });
    });
}

//The function will delete an employee by finding their employee number
module.exports.deleteEmployeeByNum = (empNum) => {

    return new Promise( (resolve, reject) => {

        Employee.destroy({
            where : {
                employeeNum : empNum
            }
        })
        .then( () => {
            return resolve();
        })
        .catch( () => {
            return reject();
        });
    });
}
