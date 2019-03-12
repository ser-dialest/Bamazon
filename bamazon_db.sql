CREATE DATABASE bamazon;

CREATE TABLE products (
	item_id				INT NOT NULL AUTO_INCREMENT,
    product_name		VARCHAR(50) NULL,
    product_description	VARCHAR(250) NULL,
    customer_price		DECIMAL(10,2) NULL,
    stock_quantity		INT DEFAULT 0,
    department			INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY fk_department (department)
    REFERENCES departments (id)
);


