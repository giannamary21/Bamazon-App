var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 8889,
	user: 'root',
	password: 'root',
	database: 'bamazon'
});
function promptManagerAction() {

	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (opt) {
				if (opt === 'View Products for Sale') {
					return 'sale';

				} else if (opt === 'View Low Inventory') {
					return 'lowInventory';

				} else if (opt === 'Add to Inventory') {
					return 'addInventory';

				} else if (opt === 'Add New Product') {
					return 'newProduct';

				} else {
				
					console.log('ERROR: Exit');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		
		if (input.option ==='sale') {
			displayInventory();

		} else if (input.option === 'lowInventory') {
			displayLowInventory();

		} else if (input.option === 'addInventory') {
			addInventory();

		} else if (input.option === 'newProduct') {
			createNewProduct();

		} else {
			console.log('ERROR:Operation not supported!');
			exit(1);
		}
	})
}

function displayInventory() {
	queryStr = 'SELECT * FROM products';

	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log(data);
		console.log("-------------------------------------------------------\n");
		connection.end();
	})
}

function displayLowInventory() {
	queryStr = 'SELECT * FROM products Where stock_quantity < 5';
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Low Inventory less then 5 left): ');
		console.log(data);
		console.log("--------------------------------------------------------\n");

		connection.end();
	})
}

function addInventory() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock total update.'
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?'
			
		}
	]).then(function(answer) {
		
		var item = answer.item_id;
		var addQuantity = answer.quantity;
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInventory();

			} else {
				var productData = data[0];

				console.log('Updating Inventory...');

				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
	
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n---------------------------------------------------------------------\n");


					connection.end();
				})
			}
		})
	})
}

function createNewProduct() {
	
	inquirer.prompt([
		
function bamazon() {
	
	promptManagerAction();
}

bamazon();
