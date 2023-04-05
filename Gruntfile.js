module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*!\n' +
        ' * <%= pkg.name %> <%= pkg.version %>\n' +
        ' * <%= pkg.description %>\n' +
        ' *\n' +
        ' * Author: <%= pkg.author %>\n' +
        ' * Licensed under <%= pkg.license %> (https://opensource.org/licenses/<%= pkg.license %>)\n' +
        ' *\n' +
        ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' */\n'
      },
      build: {
        src: 'src/**/*.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
