module.exports = (grunt) ->

  grunt.initConfig
    qunit:
      files: ['src/reveal.js/test/*.html']

  grunt.loadNpmTasks 'grunt-contrib-qunit'

  grunt.registerTask 'test', ['qunit'];