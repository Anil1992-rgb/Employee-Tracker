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

    const roleList = [];

    const managerList = [];

    connection.query("SELECT title FROM tablesDB.role", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title)
        }

        connection.query("SELECT first_name, last_name FROM tablesDB.employee", function(err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                managerList.push(res[i].first_name + " " + res[i].last_name)
            }

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
                        choices: roleList
                    },
                    {
                        type: "list",
                        name: "managerId",
                        message: "Who is the employees manager?",
                        choices: managerList
                    }
                ])
                .then(val => {
                    connection.query(
                        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, (select id from role where title = ?), (select id from  (SELECT * FROM employee) AS A where id = (select id from  (SELECT * FROM employee) AS A where concat(first_name, ' ', last_name) = ?)));", [
                            val.firstName,
                            val.lastName,
                            val.role,
                            val.managerId
                        ],
                        function(err, res) {
                            if (err) throw err;
                            console.log("\n");
                            console.log("Successfully added Employee");
                            console.log("\n");
                            runSearch();
                        }
                    );
                });
        })
    })
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
                console.log("\n");
                console.log("successfully added Department");
                console.log("\n");
                runSearch();
            });
        });
}

function addRole() {
    const deptChoicesArr = [];

    connection.query("SELECT name FROM tablesDB.department;", function(err, res) {
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
                        console.log("\n");
                        console.log("successfully added Role");
                        console.log("\n");
                        runSearch();
                    });
            });
    });

}

function updateRole() {
    const employeeArr = [];
    const roleList = [];

    connection.query("SELECT title FROM tablesDB.role;", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title)
        }

        connection.query("SELECT concat(employee.first_name, ' ', employee.last_name) AS Name, role.title FROM employee JOIN role ON (employee.role_id = role.id);",
            function(err, res) {
                if (err) throw err;

                for (var i = 0; i < res.length; i++) {
                    employeeArr.push(res[i].Name)
                }
                inquirer
                    .prompt([{
                            type: "list",
                            name: "employeeChoice",
                            message: "Who's role do you want to change?",
                            choices: employeeArr
                        },
                        {
                            type: "list",
                            name: "newRole",
                            message: "Choose the new role",
                            choices: roleList
                        }
                    ])
                    .then(val => {
                        const employeeFirstName = val.employeeChoice
                            .split(" ")
                            .slice(0, -1)
                            .join(" ");
                        const employeeLastName = val.employeeChoice
                            .split(" ")
                            .slice(-1)
                            .join(" ");

                        connection.query(
                            `UPDATE tablesDB.employee SET role_id = (SELECT id FROM (SELECT * FROM role) AS A WHERE title = '${val.newRole}') WHERE id = (SELECT id from (SELECT * FROM employee) AS A WHERE first_name = '${employeeFirstName}'AND last_name = '${employeeLastName}');`,
                            function(err, res) {
                                if (err) throw err;
                                console.log("\n");
                                console.log("successfully updated Role");
                                console.log("\n");
                                runSearch();
                            }
                        );
                    });
            });
    });
};

function exit() {
    connection.end();
}