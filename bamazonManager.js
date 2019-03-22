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

function execute(choice) {
    switch (choice) {
        case "View Products for Sale":
            products();
            break;
        case "View Low Inventory":
            lowInventory();
            break;
        case "Add to Inventory":
            addInventory();
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
    ]).then(function(answer) {
        switch (answer.order) {
            case "Item ID":
                order = "item_id";
                break;
            case "Name":
                order = "product_name";
                break;
            case "Department":
                order = "departments.id";
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

function lowInventory() {
    connection.query(`SELECT * FROM products LEFT JOIN departments ON products.department = departments.id WHERE stock_quantity < 5 ORDER BY departments.id`, function (err, res) {
        if (err) { throw err };
        console.log("ID\t" + "Item".padEnd(30, " ") + "Product Description".padEnd(70, " ") + "Price".padStart(8, " ") + "\t" + "In Stock".padStart(8, " ") + "\tDepartment");        
        for (i=0; i<res.length; i++) {
            console.log(res[i].item_id + "\t" + res[i].product_name.padEnd(30, " ") + res[i].product_description.padEnd(70, " ") + res[i].customer_price.toFixed(2).padStart(8, " ") + "\t" + res[i].stock_quantity.toFixed(0).padStart(8, " ") + "\t" + res[i].name);
        };
        another();
    });
};

function addInventory() {
    connection.query(`SELECT * FROM products LEFT JOIN departments ON products.department = departments.id`, function (err, res) {
        if (err) { throw err };
        var ids = [];
        console.log("ID\t" + "Item".padEnd(30, " ") + "Product Description".padEnd(70, " ") + "Price".padStart(8, " ") + "\t" + "In Stock".padStart(8, " ") + "\tDepartment");        
        for (i=0; i<res.length; i++) {
            ids.push(res[i].item_id);
            console.log(res[i].item_id + "\t" + res[i].product_name.padEnd(30, " ") + res[i].product_description.padEnd(70, " ") + res[i].customer_price.toFixed(2).padStart(8, " ") + "\t" + res[i].stock_quantity.toFixed(0).padStart(8, " ") + "\t" + res[i].name);
        };
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the ID of the item you will add stock to:",
                name: "choice",
                validate: function validation(input) {
                    var inputNum = parseInt(input);
                    if (!isNaN(inputNum) && ids.includes(inputNum)) { return true }
                    else { return false };
                }
            },
            {
                type: "input",
                message: "How many units will you add?",
                name: "addStock",
                validate: function validation(input) {
                    var inputNum = parseInt(input);
                    if (!isNaN(inputNum)) { return true }
                    else { return false };
                }
            },
            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: true
            }

        ]).then(function (answers) {
            if (answers.confirm) {
                var id = parseInt(answers.choice);
                var restock = parseInt(answers.addStock)
                var quantity = res[id-1].stock_quantity + restock;
                console.log(id);
                console.log(res[id-1].stock_quantity, restock, quantity);

                connection.query("UPDATE products SET stock_quantity = " + quantity + " WHERE item_id = " + id, function (err, res) {
                    if (err) { throw err };
                    console.log(res.affectedRows + " record(s) updated");
                    another();
                });
            }
            else {
                console.log("Action cancelled.");
                another();
            }
        })        
    });
};

function addProduct() {
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) { throw err };
        var ids = [];
        var names = [];
        for (var i = 0; i < res.length; i++) {
            ids.push(res[i].id);
            names.push(res[i].name);
        }
        inquirer.prompt([
            {
                type: "input",
                message: "Enter name of product:",
                name: "name"
            },
            {
                type: "input",
                message: "Enter product description:",
                name: "description"
            },
            {
                type: "input",
                message: "Enter price:",
                name: "price",
                validate: function validation(input) {
                    var inputNum = Number(input).toFixed(2);
                    if (!isNaN(inputNum)) { return true }
                    else { return false };
                }
            },
            {
                type: "input",
                message: "Enter initial quantity:",
                name: "quantity",
                validate: function validation(input) {
                    var inputNum = parseInt(input);
                    if (!isNaN(inputNum)) { return true }
                    else { return false };
                }
            },
            {
                type: "list",
                message: "To which department does this product belong?",
                choices: names,
                name: "department"
            },
            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: true
            }
        ]).then(function(answers) {
            if (answers.confirm) {
                var index = names.indexOf(answers.department);
                var departmentId = ids[index];
                connection.query(`INSERT INTO products (product_name, product_description, customer_price, stock_quantity, department) 
                VALUES ("${answers.name}", "${answers.description}", ${Number(answers.price).toFixed(2)}, ${parseInt(answers.quantity)}, ${parseInt(departmentId)})`, function (err, res) {
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
