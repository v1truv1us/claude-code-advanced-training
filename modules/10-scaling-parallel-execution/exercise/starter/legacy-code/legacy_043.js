// legacy file 43
const fs = require('fs');
fs.readFile('data.txt', function(err, data){ if(err) return console.error(err); console.log(data.toString()); });
