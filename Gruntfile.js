// Gruntfile with the configuration of grunt-express and grunt-open. No livereload yet!
module.exports = function(grunt) {

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-node-auto-deploy');

    // Configure Grunt
    grunt.initConfig({

        // grunt-express will serve the files from the folders listed in `bases`
        // on specified `port` and `hostname`
        express: {
            all: {
                options: {
                    port: 9000,
                    hostname: "0.0.0.0",
                    bases: [__dirname], // Replace with the directory you want the files served from
                                        // Make sure you don't use `.` or `..` in the path as Express
                                        // is likely to return 403 Forbidden responses if you do
                                        // http://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
                    livereload: true
                }
            }
        },

        // auto deploy
        node_auto_deploy: {
            options: {
                url: '141.52.52.181',
                alias: ['http://itas-intranet.itas.kit.edu/'],
                conf: false,
                command: 'npm install bower install forever restart all',
                port: '22',
                path: '/var/www/projects/osm-test-app/',
                git: 'git@bitbucket.org:tobias_domnik/osm-test-app.git',
                branch: 'master',
                ssh: ' ',
                before: [
                    'echo hello'
                ],
                then: [
                    'grunt less'
                ]
            }
        },
        // grunt-watch will monitor the projects files
        watch: {
            src: {
                files: ['js/*.js', 'less/*.less', 'html/*.html', '*.html'],
                tasks: ["less"]
            },
            options: {
                livereload: true
            }
        },

        // grunt-open will open your browser at the project's URL
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:<%= express.all.options.port%>'
            }
        },
        // grunt less task
        less: {
            // production config is also available
            development: {
                options: {
                    // Specifies directories to scan for @import directives when parsing.
                    // Default value is the directory of the source, which is probably what you want.
                    paths: ["less/"]
                },
                files: {
                    // compilation.css  :  source.less
                    "css/app.css": "css/app.less"
                }
            }
        }
    });

    // Creates the `server` task
    grunt.registerTask('server', [
        'express',
        'open',
        'watch'
    ]);
};