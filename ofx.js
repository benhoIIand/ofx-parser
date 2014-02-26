var xml2json = require('xml2js');

function parse(data, cb) {
    // firstly, split into the header attributes and the footer sgml
    var ofx = data.split('<OFX>', 2);

    // firstly, parse the headers
    var headerString = ofx[0].split(/\r?\n/);
    var header = {};
    
    headerString.forEach(function(attrs) {
        var headAttr = attrs.split(/:/,2);
        header[headAttr[0]] = headAttr[1];
    });

    function arrayToObject(key, value) {
        return value instanceof Array && value.length === 1 ? value[0] : value;
    }

    function recursive(o, func) {
        for (var i in o) {
            o[i] = func.apply(this, [i, o[i]]);  

            if (o[i] !== null && typeof(o[i]) === 'object') {
                recursive(o[i], func);
            }
        }

        return o;
    }


    xml2json.parseString('<OFX>' + ofx[1], function(err, results) {

        if(err) {
            console.error(err);
        } else {
            cb(recursive(results, arrayToObject));
        }
    });
}

function serialize(header, body) {
    var out = '';
    // header order could matter
    var headers = ['OFXHEADER', 'DATA', 'VERSION', 'SECURITY', 'ENCODING', 'CHARSET',
        'COMPRESSION', 'OLDFILEUID', 'NEWFILEUID'];

    headers.forEach(function(name) {
        out += name + ':' + header[name] + '\n';
    });
    out += '\n';

    out += objToOfx({ OFX: body });
    return out;
}

var objToOfx = function(obj) {
  var out = '';

  Object.keys(obj).forEach(function(name) {
    var item = obj[name];
    var start = '<' + name + '>';
    var end = '</' + name + '>';

    if (item instanceof Object) {
        if (item instanceof Array) {
            item.forEach(function(it) {
                out += start + '\n' + objToOfx(it) + end + '\n';
            });
            return;
        }
        return out += start + '\n' + objToOfx(item) + end + '\n';
    }
    out += start + item + '\n';
  });

  return out;
}

module.exports.parse = parse;
module.exports.serialize = serialize;
