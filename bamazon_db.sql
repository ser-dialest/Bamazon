DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE departments (
	id 			INT NOT NULL AUTO_INCREMENT,
    name		VARCHAR(30) NOT NULL,
    description VARCHAR(200) NULL,
	PRIMARY KEY(id)
);

USE bamazon;
INSERT INTO departments (name, description)
VALUES ("Systems", "Home and handheld video game consoles"), 
("Accessories", "Accessories for game consoles. Controllers, power cables, etc."), 
("NES", "Video games for the Nintendo Entertainment System"), 
("SNES", "Video games for the Super Nintendo Entertainment System");

USE bamazon;
SELECT * FROM departments;

USE bamazon;
CREATE TABLE products (
	item_id				INT NOT NULL AUTO_INCREMENT,
    product_name		VARCHAR(50) NULL,
    product_description	VARCHAR(250) NULL,
    customer_price		DECIMAL(10,2) NULL,
    overhead_cost		DECIMAL(10,2) NULL,
    stock_quantity		INT DEFAULT 0,
    gross				DECIMAL(10,2) DEFAULT 0,
    department			INT NOT NULL,
    PRIMARY KEY (item_id),
    FOREIGN KEY fk_department (department)
    REFERENCES departments (id)
);

USE bamazon;
INSERT INTO products (product_name, product_description, customer_price, overhead_cost, stock_quantity, department)
VALUES ("NES", "Nintendo Entertainment System", 49.99, 200.00, 8, 1),
("SNES", "Super Nintendo Entertainment System", 69.99, 200.00, 5, 1),
("NES Controller", "Standard controller for the NES", 8.00, 45.00, 15, 2),
("NES Advantage", "1st-party joystick with turbo for NES", 15.00, 20.00, 2, 2),
("NES Max", "1st-party alternative to NES controller with turbo", 11.00, 24.00, 4, 2),
("Super Mario Bros.", "Original hit platformer featuring Nintendo mascot Mario", 3.00, 23.00, 23, 3),
("Mega Man", "Action platformer from Capcom. Defeat Dr. Wily as the heroic Mega Man!", 18.00, 75.00, 5, 3),
("Teenage Mutant Ninja Turtles", "Play as the turtles from the hit TV show in this game by Konami", 6.00, 16.00, 4, 3),
("Bionic Commando", "A soldier with a bionic arm must rescue Super Joe!", 9.00, 30.00, 6, 3),
("SNES Controller", "Standard controller for the SNES", 10.00, 56.00, 7, 2),
("SNES AC Adaptor", "Power supply for SNES", 8.00, 12.00, 3, 2),
("NES RF Modulator", "RF Modulator for NES and SNES", 7.00, 15.00, 5, 2),
("Super Mario World", "Mario's 16-bit premier for SNES. Ride Yoshi!", 9.00, 15.00, 6, 4);

USE bamazon;
SELECT * FROM products;

USE bamazon;
SELECT * FROM products
LEFT JOIN departments ON products.department = departments.id 
ORDER BY departments.id;

USE bamazon;
UPDATE products
SET product_description = "Mario's 16-bit premier for SNES. Ride Yoshi!"
WHERE item_id = 13;

USE bamazon;
SELECT COUNT(*) FROM products;

USE bamazon;
SELECT department, 
SUM(stock_quantity)
FROM products
GROUP BY department;

USE bamazon;
SELECT departments.name,
SUM(products.customer_price)
FROM departments LEFT JOIN products ON products.department = departments.id
GROUP BY departments.id;

USE bamazon;
SELECT departments.id AS ID, departments.name AS Department, SUM(products.overhead_cost) AS Overhead, SUM(products.gross) AS "Gross Sales", SUM(products.gross) - SUM(products.overhead_cost) AS Profits
FROM departments LEFT JOIN products ON products.department = departments.id
GROUP BY departments.id;