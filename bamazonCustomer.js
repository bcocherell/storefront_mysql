require("dotenv").config();

var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  port     : process.env.MYSQL_PORT,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PWD,
  database : 'bamazon'
});
 
// connect to the bamazon database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log ('Welcome to BAMazon!')
  start();
});

function start() {
  // query the database for all items being sold
  connection.query("select * from products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to purchase
    inquirer.prompt([
      {
        name: "choice",
        type: "list",
        choices: function() {
          var choiceArray = [];          
          for (var i = 0; i < results.length; i++) {
            choiceArray.push({
              value: i,
              name: results[i].product_name + ' ($' + results[i].price + ')'
            });
          }
          return choiceArray;
        },
        message: "What item would you like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many do you need?",
        validate: function(value) {
          // testing for positive integer value using only digits
          return /^\d+$/.test(value);
        }
      }
    ])
    .then(function(answer) {
      // get the information of the chosen item
      var chosenItem = results[answer.choice];
    
      // determine if we have enough in stock
      if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
        // we did have stock available, fulfill request and let user know how much they owe
        connection.query(
          "update products set ? where ?",
          [
            {
              stock_quantity: chosenItem.stock_quantity - answer.quantity
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log('\nYou owe me $' + (answer.quantity * chosenItem.price).toFixed(2) + ', BAM!\n');
            again();
          }
        );
      }
      else {
        // Not enough quantity available
        console.log("\nWe don't have enough in stock for your order (qty available: " + chosenItem.stock_quantity + "). Please try again... BAM!\n");
        start();
      }
    });
  });
}

// Prompt user if they'd like to purchase another item, otherwise quit and close the connection
function again() {
  inquirer.prompt({
    name: "again",
    type: "confirm",
    message: "Would you like to purchase another item?"
  }).then(function(answer) {
    if (answer.again) {
      start();
    }
    else {
      console.log("\nBye!");
      connection.end();
    }
  });
}