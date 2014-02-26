var ofx = require('./ofx');
var fs = require('fs');

var file = fs.readFileSync(__dirname + '/test/data/example1.ofx', 'utf8');

ofx.parse(file, function(data) {
    console.log(data);
    console.log(JSON.stringify(data));
});
