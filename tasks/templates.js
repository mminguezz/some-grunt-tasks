module.exports = function( grunt ) {
// @todo change foo to prefix
    templateConfs = function(){
        var conftype = 'No se ha indicado la opcion "--type" para saber que plantilla hay que generar';
        var vars = grunt.config('vars');
        var readconfig = vars.templates.readconfig;

        if ( grunt.option('type') ) {
            conftype = 'No se a encontrado el archivo de configuración: '+ readconfig['yellow'] + '/template--'['yellow'] + grunt.option('type')['yellow'] + '.json'['yellow'];
            if ( grunt.file.exists( readconfig +'/template--'+ grunt.option('type') +'.json' ) ) {
                conftype = grunt.file.readJSON( readconfig +'/template--'+ grunt.option('type') +'.json' );
            }
        }

        return conftype;
    };

    config = {
        tmpConf : templateConfs(),
        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            templates: {
                src: "<%= vars.templates.temporary %>/"
            }
        },

        // https://github.com/gruntjs/grunt-contrib-copy
        copy: {
            templates: {
                files: [{
                    expand: true,
                    cwd: '<%= vars.templates.origin_files %>',
                    src: ['**/{<%= tmpConf.process %>}*.{less,html}', '!**/{<%= tmpConf.noprocess %>}*.{less,html}' ],
                    dest: '<%= vars.templates.temporary %>/<%= tmpConf.namespace %>'
                }],
            },
            lessreference: {
                files: [{
                    expand: true,
                    cwd: '<%= vars.templates.origin_css %>',
                    src: ['**/_*.less' ],
                    dest: '<%= vars.templates.temporary %>/<%= tmpConf.namespace %>/less/reference'
                }],
            },
        },

        // https://github.com/gruntjs/grunt-contrib-jst
        jst: {
            templates: {
                options: {
                    namespace: '<%= tmpConf.namespace %>',
                    odest: '<%= vars.templates.temporary %>/<%= tmpConf.namespace %>/<%= tmpConf.template %>.js',
                    processName: function(filepath) {
                        return filepath.toLowerCase().replace('.tpl.html', '').split("/").pop(-1);
                    },
                    templateSettings: {
                        interpolate : /\{\{(.+?)\}\}/g,
                        variable: 'data'
                    },
                    prettify: true,
                    processContent: function(cont) {
                        var content = '';
                        content += '<% var prefixCol ="' + grunt.config('tmpConf').colPrefix + '" ;%>';
                        content += '<% var template ="'  + grunt.config('tmpConf').classPrefix + '"; %>';
                        content += '<% var ie7Support ="' + grunt.config.get('vars').ieSupport + '"; %>';
                        content += cont.replace(/(^\s+|\s+$)/gm, '').replace(/\n/g, '');

                        return content;
                    }
                },

                files: [{
                    "<%= jst.templates.options.odest %>": ["<%= vars.templates.temporary %>/<%= tmpConf.namespace %>/html/*.html"]
                }]
            }
        },

        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            options: {
                banner: "/* <%= pkg.name %> v<%= pkg.version %>*/\n",
            },
            templates: {
                options: {
                    banner: "<%= concat.options.banner %>" + "function <%= tmpConf.tplfunction %>(templatePath, data) { var templateString = foo['<%= tmpConf.namespace  %>'][templatePath]; return data ? templateString(data) : templateString;}\n"
                },
                files: [{
                    expand: true,
                    cwd: '<%= vars.templates.temporary %>/<%= tmpConf.namespace %>',
                    src: ['*.js'],
                    dest: '<%= vars.templates.destination %>/',
                    ext: '.js'
                }]
            },
        },

        // https://github.com/assemble/assemble-less
        less: {
            templates: {
                options: {
                    imports: {
                        reference: ['reference/_config.less', 'reference/_layout.less', 'reference/_mixins.less']
                    },
                    modifyVars: {
                        'selector'   : '<%= tmpConf.classPrefix %>',
                        'ie7-support': '<%= vars.ieSupport %>',
                        'prefixCol'  : '<%= tmpConf.colPrefix %>',
                        'arrayCol'   : '<%= tmpConf.arrayCol %>',
                    },
                    odest: '<%= vars.templates.temporary %>/<%= tmpConf.namespace %>/<%= tmpConf.template %>.css'
                },

                files: {
                    "<%= less.templates.options.odest %>": "<%= vars.templates.temporary %>/<%= tmpConf.namespace %>/less/*.less"
                }
            }
        },

        // https://github.com/nDmitry/grunt-postcss
        //   https://github.com/ben-eb/cssnano
        //   https://github.com/postcss/autoprefixer
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    }),
                    require('cssnano')({
                        autoprefixer: false,
                        discardComments: {removeAll: true},
                        zindex: false
                    })
                ]
            },

            templates: {
                expand: true,
                flatten: true,
                src:  '<%= vars.templates.temporary  %>/<%= tmpConf.namespace %>/*.css',
                dest: '<%= vars.templates.destination %>/'
            },
        },

        // https://github.com/dylang/grunt-notify
        notify: {
            templates: {
                options: {
                    title: grunt.option('type') + ' - Templates',  // optional
                    message: 'Creados los templates para ' + grunt.option('type'), //required
                },
            },
        },


    };

    grunt.config.merge(config);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-notify');


    var fooreplacetemplates = function( filepath ){
        var filecontent = grunt.file.read(filepath);

        filecontent = filecontent.replace(/this\[/g, 'foo[');
        grunt.file.write( filepath, filecontent);
    }

    grunt.registerTask('replacetemplates', 'Change in JST task "this" to "okn".', function() {
        fooreplacetemplates( grunt.config.get('jst').templates.options.odest );
    });


    grunt.registerTask(
          'templates'
        , 'Crea plantillas underscore segun una configuración dada ' + '\n                             '
           + 'grunt templates --type=base'['yellow'] + '  ( Crea el archivo de plantillas "base" )'+'\n '
        , function(){
            var tmpConf = templateConfs();
            if (grunt.util.kindOf( tmpConf ) == 'string' ) {
                grunt.log.writeln('#####     '['red']+ '\n' + '#####     '['red'] + tmpConf + '\n'  + '#####     '['red']+ '\n' );
            } else {
                grunt.task.run([
                      'clean:templates'
                    , 'copy:templates'
                    , 'copy:lessreference'
                    , 'jst:templates'
                    , 'replacetemplates'
                    , 'concat:templates'
                    , 'less:templates'
                    , 'postcss:templates'
                    , 'clean:templates'
                    , 'notify:templates'
                ]);
            }

        }
    );

}
