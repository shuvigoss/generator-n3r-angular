'use strict';
module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

    var cfg = {
        src: 'app/',
        // Change 'localhost' to '0.0.0.0' to access the server from outside.
        serverHost: '0.0.0.0',
        serverPort: 8000,
        livereload: 35729
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'dist',
            tempDir: '.tmp'
        },

        pkg: grunt.file.readJSON('package.json'),

        // 配置Web Server
        connect: {
            'static': {
                options: {
                    hostname: 'localhost',
                    port: 8001,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ],
                    livereload: cfg.livereload
                }
            },
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8000,
                    middleware: function (connect) {
                        return [proxySnippet];
                    },
                    open: true
                },
                proxies: [
                    {
                        context: '/tools',
                        host: 'localhost',
                        port: 8080
                    },
                    {
                        context: '/',
                        host: 'localhost',
                        port: 8001

                    }
                ]
            }
        },

        // 编译less文件
        less: {
            dist: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: [
                    {
//                    "<%= yeoman.app %>/styles/main.css": "<%= yeoman.app %>/styles_less/main.less"

                        expand: true,
                        cwd: '<%= yeoman.app %>/styles_less',
                        src: '{,*/}*.less',
                        dest: '<%= yeoman.app %>/styles',
                        ext: '.css'
                    }
                ]
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,**/}*.js',
                        '<%= yeoman.dist %>/styles/{,**/}*.css'
//                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
//                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/{,**/}*.html',
            options: {
//                root: '<%= yeoman.dist %>',
                dest: '<%= yeoman.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,**/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,**/}*.css']
//            options: {
//                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
//            }
        },

        // 优化图片文件
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,**/}*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    // Optional configurations that you can uncomment to use
                    // removeCommentsFromCDATA: true,
                    // collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    // removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        replace: {
            dist_build_time: {
                options: {
                    variables: {
                        "build-time": (new Date()).getTime().toString()
                    },
                    prefix: '@@'
                },
                expand: true,
                cwd: '<%= yeoman.dist %>',
                src: ['**/*.*'],
                dest: '<%= yeoman.dist %>'
            }
        },

        // 清除文件
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            'dist_after': '.tmp',
            server: '.tmp'
        },

        // Add vendor prefixed styles
        //http://www.cnblogs.com/aNd1coder/p/autoprefixer.html
        autoprefixer: {
            options: {
                browsers: ['last 2 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,**/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },


        // js代码检查
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        requireJSOptimise: 'uglify2',
        requirejs: {
            compile: {
                options: {
                    appDir: '<%= yeoman.app %>/scripts/',
                    baseUrl: '.',
                    dir: '<%= yeoman.dist %>/scripts/',
                    keepBuildDir: true,
                    generateSourceMaps: false,
                    optimize: '<%= requireJSOptimise %>',
                    uglify2: {
                        output: {
                            beautify: false
                        },
                        mangle: true
                    },
                    mainConfigFile: '<%= yeoman.app %>/scripts/main.js',
                    modules: [
                        {
                            name: 'main',
                            include:[
                                "jQuery",
                                "angular",
                                "ngResource",
                                "ngRoute",
                                "ngCookies",
                                "ngSanitize",
                                "json3",
                                "config"
                            ]
                        },
                        {
                            name:"example/main",
                            exclude:["main"]
                        }
                    ],
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    fileExclusionRegExp: /^\./,
                    inlineText: true
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'bower_components/**/*',
                            'images/{,**/}*.{webp}',
                            'fonts/*',
                            'scripts/**/*',
                            'views/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/styles',
                        dest: '<%= yeoman.dist %>/styles',
                        src: [
                            '{,*/}*.css'
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,**/}*.css'
            }
        },


        // Run some tasks in parallel to speed up the build process
        concurrent: {
            dist: [
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },

        // 测试
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        // 文件监听
        watch: {
            options: {
                livereload: true
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            css: {
                files: ['<%= yeoman.app %>/styles_less/{,*/}*.less'],
                tasks: ['newer:less', 'newer:copy:styles', 'autoprefixer'],
                options: {
                    nospawn: true
                }
            },
            js: {
                files: ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            livereload: {
                options: {
                    livereload: cfg.livereload
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        }
    });


    grunt.registerTask('scripts', ['ngmin', 'requirejs']);
    grunt.registerTask('styles', ['less', 'copy:styles', 'autoprefixer']);
    grunt.registerTask('useminBuild', ['useminPrepare', /*'concat',*/ 'ngmin', /*'cssmin', 'uglify',*/ 'rev', 'usemin']);

    grunt.registerTask('setup-dev', 'Development related settings', function () {
        grunt.config.set('requireJSOptimise', 'none');
    });

    // 启动开发的Web Server
    grunt.registerTask('server', [
        'setup-dev',
        'clean:server',
        'copy:styles',
        'connect:static',
        'configureProxies:server',
        'connect:server',
        'autoprefixer',
        'watch'
    ]);

    // 发布
    grunt.registerTask('build', [
        'clean:dist',
        'styles',
        'concurrent:dist',
        'copy:dist',
        'scripts',
        'useminBuild',
        'replace:dist_build_time',
        'clean:dist_after'
    ]);

    // 测试
    grunt.registerTask('test', [
        'clean:server',
        'copy:styles',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);
}