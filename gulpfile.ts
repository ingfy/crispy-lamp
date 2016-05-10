/// <reference path="./custom-typings/gulp-zip.d.ts" />

import gulp = require('gulp');
import del = require('del');
import sourcemaps = require('gulp-sourcemaps');
import zip = require('gulp-zip');
import typescript = require('gulp-typescript');
import fs = require('fs');
import {Server} from 'karma';
import concat = require('gulp-concat');
import glob = require('glob');
import through = require('through2');

function addWebResources(pattern: string, options) {    
    options = options || {};
    
    return through.obj((file, enc, callback) => {
        glob(pattern, (err, files) => {
            let manifest = JSON.parse(file.contents.toString(enc));
            if (options.ignorePath) {
                files = files.map(file => file.replace(new RegExp(`^${options.ignorePath}/?(.*)$`), '$1'));
            }
            manifest.web_accessible_resources = files;
            let json = JSON.stringify(manifest, null, 4);
            file.contents = new Buffer(json, enc);
            
            callback(null, file);
        });
    })
}


gulp.task('compile', () => {
    let project = typescript.createProject('tsconfig.json');
    
    return project.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(project))
        .pipe(sourcemaps.write({sourceRoot: './src'}))
        .pipe(gulp.dest('build/app'));
});

gulp.task('build', ['compile', 'manifest', 'resources', 'loader']);

gulp.task('default', ['build']);

gulp.task('zip', ['build'], () => {
    let manifest = JSON.parse(fs.readFileSync('build/manifest.json').toString());
    let packageName = `${manifest.name} v${manifest.version}`;
    let packageFileName = `${packageName}.zip`;
    
    return gulp.src('build/**/*')
        .pipe(zip(packageName))
        .pipe(gulp.dest('dist'));
});

function karmaServer(singleRun: boolean, cb?: () => void) {    
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun
    }, cb).start();
}

gulp.task('test', ['build'], cb => karmaServer(true, cb));

gulp.task('test-watch', cb => karmaServer(false, cb));
gulp.task('watch', () => {
    gulp.watch("src/**/*", ['build']);
    karmaServer(false);
});



gulp.task('manifest', () => {
    return gulp.src('manifest.json')
        .pipe(addWebResources('build/app/**/*.js', {ignorePath: 'build'}))
        .pipe(gulp.dest('build'));
});

gulp.task('loader', ['compile'], () => {
    return gulp.src(['node_modules/systemjs/dist/system.src.js', 'system.loader.js'])
        .pipe(concat('contentScript.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('resources', () => {
    return gulp.src('resources/**/*')
        .pipe(gulp.dest('build/resources'));
});

gulp.task('clean', cb => del.sync(['build']));