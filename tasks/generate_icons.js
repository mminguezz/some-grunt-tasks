module.exports = function( grunt ) {

    config = {
        // https://github.com/sapegin/grunt-webfont
        // @todo https://github.com/svg/svgo mejora el svg antes de crear la fuente
        // @todo usar https://github.com/sindresorhus/grunt-svgmin para mejorar el svg original como tarea
        webfont: {
            pkg_a: {
                src: "<%= vars.fonts.origin %>/pkg-a/*.svg",
                dest: "<%= vars.fonts.destination %>",
                destCss: "<%= vars.fonts.less_des %>",
                options: {
                    font: "icons--a",
                    autoHint: false,
                    hashes: true,
                    htmlDemo: '<%= vars.fonts.icon_generate_docs %>',
                    types: "eot,woff,ttf,svg",
                    order: "eot,woff,ttf,svg",
                    stylesheet: "less",
                    template: "<%= vars.fonts.templateLess %>",
                    relativeFontPath: '../icons/',
                    destHtml: '<%= vars.fonts.documentation %>',
                    htmlDemoTemplate : '<%= vars.fonts.documentationTemplate %>',
                    templateOptions: {
                        baseClass: "pkg-a",
                        classPrefix: "icon-",
                    }
                }
            },
            pkg_b: {
                src: "<%= vars.fonts.origin %>/pkg-b/*.svg",
                dest: "<%= vars.fonts.destination %>",
                destCss: "<%= vars.fonts.less_des %>",
                options: {
                    font: "icons--b",
                    autoHint: false,
                    hashes: true,
                    htmlDemo: '<%= vars.fonts.icon_generate_docs %>',
                    types: "eot,woff,ttf,svg",
                    order: "eot,woff,ttf,svg",
                    stylesheet: "less",
                    template: "<%= vars.fonts.templateLess %>",
                    relativeFontPath: '../icons/',
                    destHtml: '<%= vars.fonts.documentation %>',
                    htmlDemoTemplate : '<%= vars.fonts.documentationTemplate %>',
                    templateOptions: {
                        baseClass: "pkg-b",
                        classPrefix: "icon-",
                    }
                }
            },
        },

        // https://github.com/assemble/assemble-less
        less: {
            icons: {
                options: {
                    compress: true
                },

                files: {
                    "<%= vars.fonts.css_des %>": "<%= vars.fonts.lesstocss %>"

                }
            }
        },

        // https://github.com/gruntjs/grunt-contrib-copy
        copy: {
            iconspkgdoc: {
                files: [{
                    expand: true,
                    cwd: '<%= vars.fonts.destination %>',
                    src: ['*' ],
                    dest: '<%= vars.fonts.documentation %>/fonts/',
                    flatten: true,
                    filter: 'isFile',
                }],
            }
        },
    };

    grunt.config.merge(config);

    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask(
          'icon-pkg'
        , 'Genera las fuentes de iconos (las fuente y el css). Pasando el paquete solo creara el indicado'
           +'\n                             '
           + 'grunt icon-pkg'['yellow'] + '  (Los pkg A y B )'
           +'\n                             '
           + 'grunt icon-pkg --pkg=a'['yellow'] + '  ( Solo el paquete a )'
           +'\n '
        , function() {
            if ( grunt.option('pkg') ==  'a' || grunt.option('pkg') == 'b' ) {
                grunt.task.run(['webfont:pkg_'+grunt.option('pkg'), 'less:icons', 'copy:iconspkgdoc']);
            } else if ( grunt.option('pkg') == undefined ) {
                grunt.task.run( ['webfont:pkg_a', 'webfont:pkg_b', 'less:icons', 'copy:iconspkgdoc'] );
            } else {
                grunt.log.writeln('##### '['red'] + '\n##### '['red'] + 'El paquete de iconos "'+ grunt.option('pkg') +'" no es un paquete valido' + '\n##### '['red']);
            }
        }
    );
}
