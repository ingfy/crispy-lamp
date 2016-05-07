let through = require('through2');

module.exports = jsonToMergeWith => 
    through.obj((file, encoding, callback) => {
        if (file.isNull()) return callback(null, file);
        if (file.isStream()) return this.emit('error', new Error('We cannot support streams! Too difficult!'));
        
        if (file.isBuffer()) {
            var source = JSON.parse(file.contents.toString(encoding));
            
            var target = Object.assign(source, jsonToMergeWith);
            
            file.contents = new Buffer(JSON.stringify(target, null, 4)); 
        }
    });