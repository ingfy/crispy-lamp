'use strict';

let gulp = require('gulp');
let mocha = require('gulp-mocha');
let del = require('del');
let sourcemaps = require('gulp-sourcemaps');
let zip = require('gulp-zip');
let typescript = require('gulp-typescript');
let fs = require('fs');
let through = require('through2');
let karma = require('karma');
let concat = require('gulp-concat');

gulp.task('compile', () => {
    let project = typescript.createProject('tsconfig.json');
    
    return project.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(project))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/app'));
});

gulp.task('zip', ['compile', 'manifest', 'resources', 'loader'], () => {
    let manifest = JSON.parse(fs.readFileSync('build/manifest.json'));
    let packageName = `${manifest.name} v${manifest.version}`;
    let packageFileName = `${packageName}.zip`;
    
    return gulp.src('build/**/*')
        .pipe(zip(packageFileName))
        .pipe(gulp.dest('dist'));
});

function karmaServer(singleRun) {
    return new Promise(resolve => new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun
    }).start(resolve));
}

gulp.task('test', cb => karmaServer(true).then(cb));

gulp.task('test-watch', cb => karmaServer(false).then(cb));

gulp.task('manifest', () => {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'));
});

gulp.task('loader', () => {
    return gulp.src(['node_modules/systemjs/dist/system.src.js', 'loader.js'])
        .pipe(concat('contentScript.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('resources', () => {
    return gulp.src('resources/**/*')
        .pipe(gulp.dest('build/resources'));
});

gulp.task('clean', cb => del.sync(['build']));