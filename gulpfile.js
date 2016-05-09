let typescript = require('typescript');
let fs = require('fs');
let gulpfile = fs.readFileSync('./gulp/gulpfile.ts').toString();
eval(typescript.transpile(gulpfile));