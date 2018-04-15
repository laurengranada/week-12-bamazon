var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');

//connects to mysql

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
});

//call info from database and display

connection.query("SELECT * FROM products", function(err, res) {
 for (var i = 0; i < res.length; i++) {
   console.log("item #" + res[i].item_id + " | " + res[i].product_name
   + " | " + res[i].department_name + " | $" + res[i].price);
 };


       var priorQuanity = res[0].stock_quantity
//prompt user to select what they want

 inquirer.prompt([
       {
           name: "item_id",
           type: "input",
           message: "What is the item number of the item you would like to purchase?"
       }, 
       {
           name: 'Quantity',
           type: 'input',
           message: "How many many would you like to buy?"
       },


// store the wanted item as a variable

   ]).then(function(answers) {
       var quantityWanted = answers.Quantity;

       var IDWanted = answers.item_id;

       var orderPrice = quantityWanted * res[0].price; 

       if (quantityWanted > priorQuanity ){
        console.log("Insufficient Quantity!");
        connection.end();
       } else{

        var newQuanity = priorQuanity - quantityWanted;
   //update mysql data
      connection.query("UPDATE products SET stock_quantity = " + newQuanity + " WHERE item_id= " + IDWanted, function(error, res){
        console.log("Your order has been processed!");
        console.log("Your total purchase is: $" + orderPrice);
        connection.end();

      });
    };



  });
});

