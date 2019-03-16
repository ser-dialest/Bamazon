require("dotenv").config();
var mysql = require("mysql");

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
    connection.query(`SELECT * FROM products
        LEFT JOIN departments ON products.department = departments.id 
        ORDER BY departments.id`, function (err, res) {
        if (err) { throw err };
            for (i=0; i<res.length; i++) {
                console.log(res[i].product_name.padEnd(30, " ") + res[i].product_description.padEnd(70, " ") + res[i].customer_price.toFixed(2).padStart(8, " ") + "\t" + res[i].stock_quantity.toFixed(0).padStart(4, " ") + "\t" + res[i].name);
            }
        // console.table(res[0].product_name + " " + res[0].product_description);

        connection.end();
    })

})