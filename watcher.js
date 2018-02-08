var watcher = require('chokidar');
var csv = require("fast-csv");
 

// One-liner for current directory, ignores .dotfiles
var csvs = {csvs: []};

watcher.watch('.', {ignored: /(^|[\/\\])\../}).on('add', (path) => {
	if (path.indexOf(".csv") != -1) {
		csv.fromPath(path)
		 .on("data", function(data){
		     console.log(data);
		 })
		 .on("end", function(){
		     console.log("done parsing");
		 });
	}
			//3. Add to SQLDB
  //console.log(path);
});
