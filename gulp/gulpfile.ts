/// <reference path="./gulp-zip.d.ts" />

import gulp = require('gulp');
import mocha = require('gulp-mocha');
import del = require('del');
import sourcemaps = require('gulp-sourcemaps');
import zip = require('gulp-zip');
import typescript = require('gulp-typescript');
import fs = require('fs');
import karma = require('karma');
import concat = require('gulp-concat');

import addWebAccessibleResources = require('./add-web-accesible-resources');

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
        .pipe(zip(packageFileName))
        .pipe(gulp.dest('dist'));
});

function karmaServer(singleRun) {
    return new Promise(resolve => new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun
    }, resolve).start());
}

gulp.task('test', ['build'], cb => karmaServer(true).then(cb));

gulp.task('test-watch', cb => karmaServer(false).then(cb));
gulp.task('watch', () => {
    gulp.watch("src/**/*", ['build']);
    karmaServer(false);
});



gulp.task('manifest', () => {
    return gulp.src('manifest.json')
        .pipe(addWebAccessibleResources('build/app/**/*.js', {ignorePath: 'build'}))
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