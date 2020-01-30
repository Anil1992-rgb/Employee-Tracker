DROP DATABASE IF EXISTS tablesDB;

CREATE DATABASE tablesDB;

USE tablesDB;

CREATE TABLE department (

    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (

    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);



INSERT INTO department (name)
VALUES ("Marketing"), ("Finance"), ("HR"), ("IT");



INSERT INTO role (title, salary, department_id)
VALUES ("Sales Rep", 58000, 1),
        ("Marketing Manager", 96000, 1),
        ("Accountant", 50000, 2),
        ("Customer Service", 31000, 3),
        ("IT Rep", 48000, 4),
        ("Operations Manager", 100000, 3);
        


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Burak", "Canbolat", 2, null),
        ("Mehmet", "Mimaroglu", 6, null),
        ("David", "Livingood", 1, 1),
        ("Trevor", "Thompson", 1, 1),
        ("Sanabah", "Kutahea", 1, 1),
        ("George", "Vargas", 3, 1),
        ("Susan", "Anderson", 4, 2),
        ("Nancy", "Brown", 4, 2),
        ("John", "Miller", 5, 2),
        ("Alex", "Farias", 5, 2);   