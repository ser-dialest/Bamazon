require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PASSWORD,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) { throw err };
    console.log("Connected as ID " + connection.threadId);
    menu();
});

function menu () {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome, supervisor!\nWhat would you like to do today?",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "menu"
        }
    ]).then(function (answer) {
        console.log();
        execute(answer.menu);
    });
};


function execute(choice) {
    switch (choice) {
        case "View Product Sales by Department":
            departments();
            break;
        case "Create New Department":
            newDepartment();
            break;
    };
};

function departments() {
    connection.query(`SELECT departments.id AS ID, departments.name AS Department, SUM(products.overhead_cost) AS Overhead, SUM(products.gross) AS "Gross", SUM(products.gross) - SUM(products.overhead_cost) AS Profits
    FROM departments LEFT JOIN products ON products.department = departments.id
    GROUP BY departments.id;`, function (err, res) {
        if (err) {throw err };
        // console.log(res);
        console.log("ID\t" + "Department".padEnd(20, " ") + "Overhead".padEnd(20, " ") + " Gross Sales".padEnd(20, " ") + "\t" + "Profits".padEnd(20, " "));        
        for (i=0; i<res.length; i++) {
            var overhead = res[i].Overhead;
            if (overhead === null) {overhead = 0};
            var gross = res[i].Gross;
            if (gross === null) {gross = 0};
            var profits = res[i].Profits;
            if (profits === null) {profits = 0};
            console.log(res[i].ID + "\t" + res[i].Department.padEnd(20, " ") + "$" + overhead.toFixed(2).padEnd(20, " ")  + "$" + gross.toFixed(2).padEnd(20, " ") + "\t$" + profits.toFixed(2).padEnd(20, " "));
        };
        console.log();
        another();
    })
}

function newDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter name of department:",
            name: "name"
        },
        {
            type: "input",
            message: "Enter department description:",
            name: "description"
        },
        {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: true
        }
    ]).then(function(answers) {
        if (answers.confirm) {
            connection.query(`INSERT INTO departments (name, description) 
            VALUES ("${answers.name}", "${answers.description}")`, function (err, res) {
                if (err) { throw err };
                console.log(res.affectedRows + " record(s) updated");
                another();
            })
        }
        else {
            console.log("Action cancelled.");
            another();
        };
    });

};

function another() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Do you wish to perform another task?",
            name: "another",
            default: true
        }
    ]).then(function (answer) {
        if (answer.another) {
            menu();
        }
        else {
            console.log("Have a great day!");
            connection.end();
        }
    })
};