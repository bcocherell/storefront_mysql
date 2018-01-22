# BAMazon Storefront

Created for a coding bootcamp assignment, the app uses a command line interface to take in orders from customers and deplete stock from the store's inventory. 

## Before You Begin

- Run `npm install` as the app makes use of [console.table](https://www.npmjs.com/package/console.table), [inquirer](https://www.npmjs.com/package/inquirer), [mysql](https://www.npmjs.com/package/mysql), and [dotenv](https://www.npmjs.com/package/dotenv) npm packages.

- Run the `schema.sql` and `seeds.sql` files to setup the `bamazon` schema and necessary tables in your mysql environment. 

- You'll need your mysql info again, along with a user that has read/write privileges to the new `bamazon` schema for this next step as the program expects a `.env` file the same directory with the following contents:

```
# MySQL Info

MYSQL_HOST=your-mysql-host
MYSQL_PORT=your-mysql-port
MYSQL_USER=your-mysql-id
MYSQL_PWD=your-mysql-pwd
```

## Commands

- `node bamazonCustomer.js`
  
  This is the customer interface. The app will prompt users with two messages... 
  - Which product they would like to buy
  - How many units they would like to buy

  The application checks if there is sufficient quantity. If so, the database is updated to reflect the remaining quantity and shows the customer the total cost of their purchase.

- `node bamazonManager.js`

  This is the manager interface and will give you the following menu options:
  
  - View Products for Sale
    - App lists every available item
  - View Low Inventory
    - Lists all items with an inventory count lower than five.
  - Add to Inventory
    - Allows manager to add additional stock for any item in the store
  - Add New Product
    - Adds a completely new product to the store