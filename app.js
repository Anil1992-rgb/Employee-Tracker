var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: process.env.PORT || 3306,

    // Your username
    user: "root",

    // Your password
    password: "4663",
    database: "tablesDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "choices",
            type: "list",
            message: "What Would You Like To Do?",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.choices) {
                case "View All Employees":
                    employeeSearch();
                    break;

                case "View All Departments":
                    departmentSearch();
                    break;

                case "View All Roles":
                    roleSearch();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Update Employee Role":
                    updateRole();
                    break;

                case "Exit":
                    exit();
                    break;
            }
        });
}

function employeeSearch() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        console.log("\n");
        runSearch();
    })
};

function departmentSearch() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        console.log("\n");
        runSearch();
    })
};

function roleSearch() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        console.log("\n");
        runSearch();
    })
};

function addEmployee() {
    inquirer
        .prompt([{
                type: "input",
                name: "firstName",
                message: "What is the employees first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?"
            },
            {
                type: "list",
                name: "role",
                message: "What is the employees role id?",
                choices: [] //////////////////////////////////////////
            },
            {
                type: "list",
                name: "managerId",
                message: "What is the employees manager ID?",
                choices: [] ///////////////////////////////////////////
            }
        ])
        .then(val => {
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: val.firstName,
                    last_name: val.lastName,
                    role_id: val.role,
                    manager_id: val.man
                },
                function(err, res) {
                    if (err) throw err;
                    runSearch();
                }
            );
        });
}

function addDepartment() {
    inquirer.prompt([{
            type: "input",
            name: "department",
            message: "Enter Department Name"
        }])
        .then(val => {
            connection.query("INSERT INTO department SET ?", {
                name: val.department
            }, function(err, res) {
                if (err) throw err;
                departmentSearch();
                runSearch();
            });
        });
}

function addRole() {
    const deptChoicesArr = [];

    connection.query("SELECT name FROM tablesdb.department;", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            deptChoicesArr.push(res[i].name)
        }
        inquirer.prompt([{
                    type: "input",
                    name: "role",
                    message: "Enter Role Name"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter Salary Number"
                },
                {
                    type: "list",
                    name: "deprtmnt_id",
                    message: "Choose Department",
                    choices: deptChoicesArr
                }
            ])
            .then(val => {
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE department.name = ?));", [
                        val.role,
                        val.salary,
                        val.deprtmnt_id
                    ],
                    function(err, res) {
                        if (err) throw err;
                        runSearch();
                    });
            });
    });

}

function updateRole() {

}

function exit() {
    connection.end();
}