module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',

        browserify: {
            dev: {
                files: {
                    './js/build.js': ['js/app.jsx', 'js/elements/*.jsx']
                },
                options: {
                    transform: ['babelify', 'reactify']
                }
            }
        },
        watch: {
            browserify: {
                files: ['js/**/*.jsx'],
                tasks: ['browserify:dev']
            },
            compass: {
                files: ['scss/**'],
                tasks: ['compass:dev']
            },
            options: {
                nospawn: true
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: 'scss',
                    cssDir: '.',
                    httpPath: '/',
                    imagesDir: 'img',
                    javascriptDir: 'js'
                }
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['browserify'])
}
