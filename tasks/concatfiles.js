module.exports = function( grunt ) {

    config = {
        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            options: {
                banner: "/* <%= pkg.name %> v<%= pkg.version %> */\n",
            },
            customfiles: {
                src:  grunt.option('src'),
                dest: grunt.option('dest')
            }
        },
        // https://github.com/dylang/grunt-notify
        notify: {
            concatfiles: {
                options: {
                    title:   'Concat',                                            // optional
                    message: 'Archivos concatenados en ' +  grunt.option('dest'), //required
                },
            }
        },
    };

    grunt.config.merge(config);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask(
          'concatfiles'
        , 'Une archivos en el orden deseado, donde "src" es origen y "dest" es el destino, ej.:'
           +'\n                             '
           +'grunt concatfiles --src=pruebas/a.js --src=pruebas/b.js --dest=a_and_b.js'['yellow']
           +'\n '
        , [
              'concat:customfiles'
            , 'notify:concatfiles'
        ]
    );
}
