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
            message: "Welcome, manager!\nWhat would you like to do today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "menu"
        }
    ]).then(function (answer) {
        console.log();
        execute(answer.menu);
    });
};
// Products for sale
// Low inventory
// Add to inventory
// Add new product

function execute(choice) {
    switch (choice) {
        case "View Products for Sale":
            products();
            break;
        case "View Low Inventory":
            lowInventory();
            break;
        case "Add to Inventory":
            addInvntory();
            break;
        case "Add New Product":
            addProduct();
            break;
    };
};

function products() {
    var order = "";
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like your inventory ordered by:",
            choices: ["Item ID", "Name", "Department", "Price", "Quantity"],
            name: "order"
        }
        // (product_name, product_description, 
        // customer_price, stock_quantity, department)
    ]).then(function(answer) {
        switch (answer.order) {
            case "Item ID":
                order = "item_id";
                break;
            case "Name":
                order = "product_name";
                break;
            case "Department":
                order = "departments.name";
                break;
            case "Price":
                order = "customer_price DESC";
                break;
            case "Quantity":
                order = "stock_quantity DESC";
                break;
        };
        connection.query(`SELECT * FROM products LEFT JOIN departments ON products.department = departments.id ORDER BY ${order}`, function (err, res) {
            if (err) { throw err };
            console.log("ID\t" + "Item".padEnd(30, " ") + "Product Description".padEnd(70, " ") + "Price".padStart(8, " ") + "\t" + "In Stock".padStart(8, " ") + "\tDepartment");        
            for (i=0; i<res.length; i++) {
                console.log(res[i].item_id + "\t" + res[i].product_name.padEnd(30, " ") + res[i].product_description.padEnd(70, " ") + res[i].customer_price.toFixed(2).padStart(8, " ") + "\t" + res[i].stock_quantity.toFixed(0).padStart(8, " ") + "\t" + res[i].name);
            };
            another();
        });
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
