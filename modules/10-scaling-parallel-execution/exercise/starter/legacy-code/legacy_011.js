// legacy file 11
const request = require('request');
request('http://example.com', function(err,res,body){ if(err) throw err; console.log(body); });
