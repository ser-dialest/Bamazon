require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var purchase = {};

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
    catalogue();
});

function catalogue() {
    connection.query(`SELECT * FROM products LEFT JOIN departments ON products.department = departments.id`, function (err, res) {
        if (err) { throw err };
        console.log("ID\t" + "Item".padEnd(30, " ") + "Product Description".padEnd(70, " ") + "Price".padStart(8, " ") + "\t" + "In Stock".padStart(8, " ") + "\tDepartment");        
        for (i=0; i<res.length; i++) {
            console.log(res[i].item_id + "\t" + res[i].product_name.padEnd(30, " ") + res[i].product_description.padEnd(70, " ") + res[i].customer_price.toFixed(2).padStart(8, " ") + "\t" + res[i].stock_quantity.toFixed(0).padStart(8, " ") + "\t" + res[i].name);
        };
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the ID of the item you would like to purchase:",
                name: "purchaseID",
                validate: function validatePurchase(input) {
                    input = parseInt(input);
                    if (isNaN(input)) { return false }
                    else { return true };
                }
            }
        ]).then(function (answer) {
            connection.query("SELECT COUNT(*) AS 'count' FROM products WHERE item_id = " + parseInt(answer.purchaseID), function (err, res) {
                if (err) { throw err };
                if (res[0].count === 0) {
                    console.log();
                    console.log("Please enter a valid product ID");
                    catalogue();
                }
                else {
                    purchase(answer.purchaseID);

                    function purchase(choice) {
                        connection.query(`SELECT * FROM products LEFT JOIN departments ON products.department = departments.id WHERE item_id = ${choice}`, function (err, res) {
                            if (err) { throw err };
                            console.log(res[0].product_name.padEnd(30, " ") + "\tPrice: " + res[0].customer_price.toFixed(2).padStart(8, " ") + "\t\t\t" + " Quantity in stock: " + res[0].stock_quantity.toFixed(0).padStart(6, " "));
                            console.log(res[0].product_description.padEnd(70, " ") + "\tDepartment: " + res[0].name);
                        })
                    };
                };
            }); 
        })
    })
};






