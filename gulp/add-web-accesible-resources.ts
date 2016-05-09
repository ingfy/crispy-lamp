import glob = require('glob');
import through = require('through2');

function addWebAccessibleResources(pattern, options) {    
    options = options || {};
    
    return through.obj((file, enc, callback) => {
        glob(pattern, (err, files) => {
            let manifest = JSON.parse(file.contents.toString(enc));
            if (options.ignorePath) {
                files = files.map(file => file.replace(new RegExp(`^${options.ignorePath}/?(.*)$`), '$1'));
            }
            Object.assign(manifest, {web_accessible_resources: files});
            let json = JSON.stringify(manifest, null, 4);
            file.contents = new Buffer(json, enc);
            
            callback(null, file);
        });
    })
}

export = addWebAccessibleResources;