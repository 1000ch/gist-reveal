module.exports = (grunt) ->

  grunt.initConfig
    qunit:
      files: ['reveal.js/test/*.html']

  grunt.loadNpmTasks 'grunt-contrib-qunit'

  grunt.registerTask 'test', ['qunit'];