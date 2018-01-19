var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'FjM3B@S7Pi*yO6&%1*^r',
  database : 'bamazon'
});
 
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log ("Welcome to BAMazon's management interface!")
  menu();
});

function menu() {
  inquirer.prompt([
    {
      name: "choice",
      type: "list",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].product_name + ' ($' + results[i].price + ')');
        }
        return choiceArray;
      },
      message: "What item would you like to purchase?"
    },
    {
      name: "quantity",
      type: "input",
      message: "How many do you need?"
    }
  ])
  .then(function(answer) {
    // get the information of the chosen item
    var chosenItem;
    for (var i = 0; i < results.length; i++) {
      if (results[i].product_name + ' ($' + results[i].price + ')' === answer.choice) {
        chosenItem = results[i];
      }
    }

    // determine if bid was high enough
    if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
      // bid was high enough, so update db, let the user know, and start over
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
          console.log('\nYou owe me $' + (answer.quantity * chosenItem.price) + ', BAM!\n');
          again();
        }
      );
    }
    else {
      // Quantity not available
      console.log("\nWe don't have enough in stock for your order (currently available: " + chosenItem.stock_quantity + "). Please try again... BAM!\n");
      start();
    }
  });
}

function start() {
  // query the database for all items being auctioned
  connection.query("select * from products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to purchase
    inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].product_name + ' ($' + results[i].price + ')');
          }
          return choiceArray;
        },
        message: "What item would you like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many do you need?"
      }
    ])
    .then(function(answer) {
      // get the information of the chosen item
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].product_name + ' ($' + results[i].price + ')' === answer.choice) {
          chosenItem = results[i];
        }
      }

      // determine if bid was high enough
      if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
        // bid was high enough, so update db, let the user know, and start over
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
            console.log('\nYou owe me $' + (answer.quantity * chosenItem.price) + ', BAM!\n');
            again();
          }
        );
      }
      else {
        // Quantity not available
        console.log("\nWe don't have enough in stock for your order (currently available: " + chosenItem.stock_quantity + "). Please try again... BAM!\n");
        start();
      }
    });
  });
}

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