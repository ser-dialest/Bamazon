require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var cart = {};

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
        var ids = [];
        console.log("ID\t" + "Item".padEnd(30, " ") + "Product Description".padEnd(70, " ") + "Price".padStart(8, " ") + "\t" + "In Stock".padStart(8, " ") + "\tDepartment");        
        for (i=0; i<res.length; i++) {
            ids.push(res[i].item_id);
            console.log(res[i].item_id + "\t" + res[i].product_name.padEnd(30, " ") + res[i].product_description.padEnd(70, " ") + res[i].customer_price.toFixed(2).padStart(8, " ") + "\t" + res[i].stock_quantity.toFixed(0).padStart(8, " ") + "\t" + res[i].name);
        };
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the ID of the item you would like to purchase:",
                name: "purchaseID",
                validate: function validatePurchase(input) {
                    var inputNum = parseInt(input);
                    if (!isNaN(inputNum) && ids.includes(inputNum)) { return true }
                    else { return false };
                }
            }
        ]).then(function (answer) {
            var number = parseInt(answer.purchaseID);
            purchase(number);                  
        })
    })
};

function purchase(choice) {
    connection.query(`SELECT * FROM products WHERE item_id = ${choice}`, function (err, res) {
        if (err) { throw err };
        cart.item_id = res[0].item_id;
        cart.customer_price = res[0].customer_price;
        cart.stock_quantity = res[0].stock_quantity;
        console.log();
        console.log(res[0].product_name.padEnd(30, " ") + "\tPrice: " + res[0].customer_price.toFixed(2).padStart(8, " ") + "\t\t\t" + " Quantity in stock: " + res[0].stock_quantity.toFixed(0).padStart(6, " "));
        console.log(res[0].product_description.padEnd(70, " "));
        inquirer.prompt([
            {
                type: "confirm",
                message: "Is this the item you would like to purchase?",
                name: "itemConfirm",
                default: true
            }
        ]).then(function(answer) {
            if (!answer.itemConfirm) {
                console.log();
                catalogue();
            }
            else {
                purchaseConfirm();
            }
        })
    })
};

function purchaseConfirm() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the quantity you would like to purchase:",
            name: "quantity",
            validate: function validatePurchase(input) {
                input = parseInt(input);
                if (isNaN(input)) { return false }
                else { return true };
            }
        }
    ]).then(function (answer) {
        var quantity = parseInt(answer.quantity);
        if (quantity > cart.stock_quantity) {
            console.log("Insufficient quantity to meet this order.");
            purchaseConfirm();
        }
        else {
            checkout(quantity);
        }
    });
};


function checkout(quantity) {
    console.log();
    var sale = cart.customer_price*quantity;
    console.log("Your order will cost $" + sale + ".");
    inquirer.prompt([
        {
            type: "confirm",
            message: "Do you wish to confirm your order?",
            name: "checkout",
            default: true
        }
    ]).then(function(answer) {
        if (!answer.checkout) {
            console.log();
            console.log("No order has been placed. Thank you for visiting!");
            connection.end();
        }
        else {
            connection.query("UPDATE products SET stock_quantity = stock_quantity -" + quantity + ", gross = gross + " + sale + "  WHERE item_id = " + cart.item_id, function (err, res) {
                if (err) { throw err };
                console.log("Thank you for your purchase! Your order has been sent.");
                connection.end();
            });
        }
    });
}
