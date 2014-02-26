var fs = require('fs');
var tap = require('tap');

var ofx = require('..');

var test = tap.test;
var plan = tap.plan;


test('parse', function (t) {
    var file = fs.readFileSync(__dirname + '/data/example1.ofx', 'utf8');

    ofx.parse(file, function(data) {

        var transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
        t.equal(transactions.length, 5);

        var status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
        t.equal(status.CODE, '0');
        t.equal(status.SEVERITY, 'INFO');

        t.end();
    });
});
