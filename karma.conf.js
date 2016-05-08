'use strict';

module.exports = config => {
    config.set({
        basePath: './',
        
        frameworks: ['systemjs', 'mocha', 'chai'],
        plugins: [
            'karma-systemjs', 
            'karma-mocha', 
            'karma-chai', 
            'karma-phantomjs-launcher',
            'karma-mocha-reporter'
        ],
        
        systemjs: {
            config: {
                transpiler: null,
                paths: {
                    'systemjs': 'node_modules/systemjs/dist/system.js',
                    'chai': 'node_modules/chai/chai.js'
                },
                packages: {
                    'build': {
                        defaultExtension: 'js'
                    }
                }
            },
            serveFiles: [
                'node_modules/**/*.js',
                'build/**/*.js'
            ]
        },
        files: [
            {pattern: 'build/*.js', incldued: false, watched: true},
            {pattern: 'build/**/*.js', incldued: false, watched: true},
            {pattern: 'build/*.spec.js', included: true, watched: true},
            {pattern: 'build/**/*.spec.js', included: true, watched: true}
        ],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};