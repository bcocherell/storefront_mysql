/* Schema for SQL database/table. We haven't discussed this type of file yet */
DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

/* Create new table with a primary key that auto-increments, and a text field */
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price NUMERIC(10, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);
