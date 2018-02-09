/*
* Interactive folder that allows you to add CSVs into different tables
* within a database by simply copying it over.
* 
* @author Davon Prewitt
* @version 1.0.0
* 
*/
var watcher = require('chokidar');

var csv = require("fast-csv");
var fs = require("fs");

const sqlite3 = require('sqlite3')
	.verbose();
var db = new sqlite3.Database('./db/data.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to DB.');
});


var index = 0;
watcher.watch('.', {ignored: /(^|[\/\\])\../}).on('add', (path) => {
	if (path.indexOf(".csv") != -1) {
		csv.fromPath(path)
		 .on("data", function(data){
		 	//DATABSE
		 	if (index == 0) {
		 		columns = '(';
		 		columnsInsert = '(';
		 		data.forEach(function(item, index, array) {
				  columns = columns + item + ' ' + 'text, ';
				  columnsInsert = columnsInsert + item +', ';
				})
				columns = columns.substr(0,columns.length - 2) + ')';
				columnsInsert = columnsInsert.substr(0,columnsInsert.length - 2) + ')';

		 		tableName = path.substr(0, path.indexOf('.csv'));
				db.run('CREATE TABLE ' + 'test' + ' '  + columns);
		 	} else {
		 		db.run('INSERT INTO ' + 'test' + ' ' + columnsInsert + ' VALUES(?,?,?,?,?,?,?)',data, function(err){
		 			if (err) {
		 				console.log(err);
		 			} 
				});
		 	}
		 	index++;
		 })
		 .on("end", function(){
		 	fs.unlink("./"+ path, (err) => {
		        if (err) {
		            console.log('Error: Failed to delete ' + path + ' ' + err);
		        } else {
		            console.log('Successfully deleted ' + path);                                
		        }
		 	});
		 console.log("Successfully added " + index + " items from " + path.substr(0, path.indexOf('.csv')));
		 });
	}
});
