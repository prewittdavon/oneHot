var watcher = require('chokidar');
var csv = require("fast-csv");
var fs = require("fs");
 

// One-liner for current directory, ignores .dotfiles
var csvs = {csvs: []};

watcher.watch('.', {ignored: /(^|[\/\\])\../}).on('add', (path) => {
	if (path.indexOf(".csv") != -1) {
		csv.fromPath(path)
		 .on("data", function(data){
		     //console.log(data);
		 })
		 .on("end", function(){
		 	fs.unlink("./"+ path, (err) => {
	        if (err) {
	            console.log('Error: Failed to delete ' + path + ' ' + err);
	        } else {
	            console.log('successfully deleted ' + path);                                
	        }
		 });
		 console.log("successfully added " + path);
		 });
	}
	//3. Add to SQLDB
});
