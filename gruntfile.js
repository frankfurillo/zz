module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
		my_target: {
		files: {
        'build/zz.min.js': ['lib/*.js', 'curve.js']
		}
		}
	}
	,
	jshint: {
		all: [ 'lib/*.js']
	},
	sass: {
			dist: {
				files: {
					'style/style.css' : 'sass/style.scss'
				}
			}
	},
	watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify','watch']);

};