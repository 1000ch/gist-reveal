module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    'html-inspector':
      all:
        src: ['src/html/*.html']
    jshint:
      all: ['src/js/*.js']
    jsvalidate:
      options:
        globals: {}
        esprimaOptions: {}
        verbose: false
      all:
        files:
          src: ['<%=jshint.all%>']
    htmlmin:
      all:
        options:
          removeComments: true
          collapseWhitespace: true
        files:
          'dist/html/background.html': 'src/html/background.html'
          'dist/html/options.html': 'src/html/options.html'
    cssmin:
      all:
        options:
          keepSpecialComments: 1
        files:
          'dist/css/bootstrap.min.css': ['src/css/bootstrap.min.css']
          'dist/css/content.css': ['src/css/content.css']
    uglify:
      all:
        files:
          'dist/js/background.js': ['src/js/background.js']
          'dist/js/content.js': ['src/js/content.js']
          'dist/js/options.js': ['src/js/options.js']
    qunit:
      files: ['src/reveal.js/test/*.html']
    exec:
      rake:
        command: 'rake'

  grunt.loadNpmTasks 'grunt-html-inspector'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-jsvalidate'

  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-exec'

  grunt.registerTask 'test', ['jshint', 'jsvalidate', 'qunit', 'html-inspector'];
  grunt.registerTask 'optimize', ['htmlmin', 'cssmin', 'uglify']
  grunt.registerTask 'build', ['optimize', 'exec'] 