var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, data) {
    if (err) throw err;
                console.log(data);
                promptUsers(data);
                console.log('Existing Inventory: ');
                console.log('...................\n');

    var strOut = '';
    for (var i = 0; i < data.length; i++) {
      strOut = '';
      strOut += 'Item ID: ' + data[i].item_id + '  //  ';
      strOut += 'Product Name: ' + data[i].product_name + '  //  ';
      strOut += 'Department: ' + data[i].department_name + '  //  ';
      strOut += 'Price: $' + data[i].price + '\n';

      console.log(strOut);
    }

console.log("--------------------------------\n");

  });
}

function promptUsers(stock){
inquirer.prompt([
{
  type: "input",
  name: "itemId",
  message: "ID of the item that you would like to purchased?"
},
{
  type: 'input',
  name: 'quantity',
  message: 'How many do you need?',
}

  ]).then(function(answer){
    var item = parseInt(answer.itemId);
    var quantity = answer.quantity;
    var queryStr = 'SELECT * FROM products WHERE ?';

    connection.query(queryStr, {item_id: item}, function(err, data) {
      if (err) throw err;
      if (data.length === 0) {
        console.log('ERROR: Invalid ID. Please select a valid ID.');

      } else {
        var productData = data[0];
          if (quantity <= productData.stock_quantity) {
          console.log('Congratulations, the product/products you requested is/are in stock! You can start placing your order now!');
          var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
          connection.query(updateQueryStr, function(err, data) {
            if (err) throw err;
            console.log('Your order has been placed!' + productData.price * quantity);
            console.log('Thank you for shopping!!!!');

            afterConnection();
            connection.end();
          })
        } else {
          console.log('Sorry, Something went wrong, your order can not be placed.');
          console.log('Please Update your order.');
          console.log("\n---------------------------------------\n");
          afterConnection();
        }
   }
    })
  })
}
