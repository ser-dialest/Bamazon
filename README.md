# Bamazon

## Overview

Create a mock command line storefront that can be accessed by customers, managers, and upper-level supervisors to purchase or add items from and to a MySQL database.

## Requirements

The user will need to install the following NPM Modules as per the dependencies found in the included package.JSON:

* Inquirer
* MySQL
* DotEnv

## Structure

Included in this suite is an SQL schema that contains the necessary queries to get started (as well as a few others). There are also three separate files depending on who is accessing this fake store, "Bamazon".

## Customer View (bamazonCustomer.js)

Bamazon customers are immediately presented with a list of all items for sale, generated from the database and ordered by their unique IDs, and is then prompted through Inquirer to select one to purchase by entering that ID. Non-valid inputs are not permitted.

Once the user has made a valid selection, they are presented with some paired-down information and asked if this is indeed the item they wished to buy. If they declined, they are brought back to the main selection. Upon confirming that, they are asked the quantity they wish to purchase.  The grand total is then presented.

If the user confirms the intent to purchase the items at that amount, the purchase is complete, the stock is deducted to from the database and the funds added to that items total. Desclining the purchase or completing the transaction terminates the session.

## Manager View (bamazonManager.js)

Managers are given access to a range of commands:

* View Products for Sale
    
* View Low Inventory

* Add to Inventory

* Add New Product

#### View Products for Sale

Generates a similar list to that which the customers see.

#### View Low Inventory

Queries the database and displays all inventory items with fewer than five units in stock, so the manager knows what to order.

#### Add to Inventory

Begins with the same list and inquiry type as the customer profile, but the item selected will this time be added rather than deducted from the stock.

The manager selects an item, and answers how many of that item will be added to the stock and how much influx of inventory cost.

After confirming, the overhead for that item and the available stock is increased in the database.

#### Add New Product

Here, a manager may add a completely new item. Name, description, price, cost for inital stock, amount of initial stock, and department of item must all be specified. Confirmation inserts this row into the table that handles inventory.

## Supervisor View (bamazonSupervisor.js)

Supervisors are given access to two upper-level commands:

* View Product Sales by Department
    
* Create New Department

#### View Product Sales by Department

The supervisor is presented with a list of the departments in the store along with the cost for each of those departments and the amount they have grossed followed by the profit. These are all calculated within the database query as sums of rows from the joined table of products.

#### Create New Department

Identical to introducing an item to the inventory. The department must be created by the supervisor before items that belong to it may be added by a manager.

Managers and supervisors are always asked if they wish to perform another action before the termination of the program.