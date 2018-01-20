var mysql = require('mysql');
var inquirer = require("inquirer");
const cTable = require('console.table');

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
      choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product', 'Quit'],
      message: "Choose a management function:"
    }
  ])
  .then(function(answer) {
    // get the information of the chosen item
    switch (answer.choice) {
      case 'View Products for Sale':
        viewProducts();
        break;
      case 'View Low Inventory':
        viewLowInventory();
        break;
      case 'Add to Inventory':
        addToInventory();
        break;
      case 'Add New Product':
        addNewProduct();
        break;
      case 'Quit':
        connection.end();
        break;
    }
  });
}

function viewProducts() {
  // query the database for all items being auctioned
  connection.query("select * from products", function(err, res) {
    if (err) throw err;
    
    console.log('');
    console.table(res);
    
    menu();
  });
}

function viewLowInventory() {
  // query the database for all items being auctioned
  connection.query("select * from products where stock_quantity < 5", function(err, res) {
    if (err) throw err;
    
    console.log('');
    
    if (res.length > 0) {
      console.table(res);
    }
    else {
      console.log('No records returned.\n')
    }
    
    menu();
  });
}

function addToInventory() {
  // query the database for all items being auctioned
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
              name: results[i].product_name + ' (price: $' + results[i].price + ', qty available: ' + results[i].stock_quantity + ')'
            });
          }
          return choiceArray;
        },
        message: "Which item did you get in?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many do you want to add to stock?",
        validate: function(value) {
          // testing to make sure input only consists of digits
          return /^-{0,1}\d+$/.test(value);
        }
      }
    ])
    .then(function(answer) {
      // get the information of the chosen item
      var chosenItem = results[answer.choice];
      var newStockQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity);
    
      // update stock for item
      connection.query(
        "update products set ? where ?",
        [
          {
            stock_quantity: newStockQuantity
          },
          {
            item_id: chosenItem.item_id
          }
        ],
        function(error) {
          if (error) throw err;
          console.log('\nQuanity updated to ' + newStockQuantity + ', BAM!\n');
          menu();
        }
      );
    });
  });
}

function addNewProduct() {

  inquirer.prompt([
    {
      name: "product_name",
      message: "Enter product name:"
    }, {
      name: "department_name",
      message: "Enter department name:"
    }, {
      name: "price",
      message: "Enter price:",
      validate: function(value) {
        if (isNaN(value)) {
          return false;
        }
        else {
          return true;
        }
      }
    }, {
      name: "stock_quantity",
      message: "Enter stock quantity",
      validate: function(value) {
        // testing for positive integer value using only digits
        return /^\d+$/.test(value);
      }
    }
  ]).then(function(answers) {
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answers.product_name,
        department_name: answers.department_name,
        price: parseFloat(answers.price).toFixed(2),
        stock_quantity: parseInt(answers.stock_quantity)
      },
      function(err, res) {
        if (err) throw err;
        console.log('\n' + res.affectedRows + ' product inserted, BAM!');
        console.log('---------------------\n');
        menu();
      }
    );
  });
};