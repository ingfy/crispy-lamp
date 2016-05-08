'use strict';

let gulp = require('gulp');
let mocha = require('gulp-mocha');
let del = require('del');
let sourcemaps = require('gulp-sourcemaps');
let zip = require('gulp-zip');
let typescript = require('gulp-typescript');

gulp.task('test', () => {
    require('typescript-require');
    
    return gulp.src('./src/**/*.spec.ts', {read: false})
        .pipe(mocha());
});

gulp.task('manifest', () => {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'));
});

gulp.task('compile', () => {
    var tsconfig = Object.assign(require('tsconfig.json'), {outFile: 'contentScript.js'});
    
    return gulp.src('./src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tsconfig))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});