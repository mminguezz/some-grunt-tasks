module.exports = function(grunt) {

    grunt.initConfig({
        // Project configuration.
        pkg:     grunt.file.readJSON('package.json'),
        vars:    grunt.file.readJSON('config/vars.json'),
        version: '<%= pkg.version %>',

        availabletasks: {
            tasks: {
                options: {
                    filter: 'exclude',
                    tasks: ['availabletasks', 'concat', 'webfont', 'less' , 'copy', 'replacetemplates', 'jst', 'clean', 'postcss', 'watch', 'notify_hooks', 'notify', 'processhtml', 'replacetemplatesdocdes']
                }
            }
        },

        // https://github.com/dylang/grunt-notify
        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 5, // maximum number of notifications from jshint output
                title: pkg.name,             // defaults to the name in package.json, or will use project directory's name
                success: false,              // whether successful grunt executions should be notified automatically
                duration: 3                  // the duration of notification in seconds, for `notify-send only
            },
        },

    });

    grunt.loadTasks( "tasks" );

    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-available-tasks');

    grunt.registerTask('default', 'Tarea por defecto que muestra el listado de tareas disponibles', ['availabletasks']);

    grunt.task.run('notify_hooks');
};
<
