"use strict";

/* VARS */
var gulp = require('gulp');
var minify = require('gulp-minify');
var sequence = require('gulp-sequence');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
// var jslint = require('gulp-jslint');
/* VARS */

/* CONSTS */
const CSS_DIR = "./css";
const JS_DIR = "./js";
const SASS_DIR = "./sass";
/* CONSTS */
 
/* TASKS */

	/* CSS */
	gulp.task('css-clean', function() {
	  return gulp.src([CSS_DIR + "/*.css", "!" + CSS_DIR + "/*.min.css"], {read: false})
		.pipe(clean());
	});
	gulp.task('css-min-clean', function() {
	  return gulp.src(CSS_DIR + "/*.min.css", {read: false})
		.pipe(clean());
	});
	
	gulp.task('css-all-in-one', function() {
	  return gulp.src([CSS_DIR + "/*.min.css", "!" + CSS_DIR + "/all.min.css"])
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest(CSS_DIR));
	});

	
		/* SASS */
		gulp.task('sass-compile', function () {
		  return gulp.src(SASS_DIR + "/*.scss")
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest(CSS_DIR));
		});
	
		gulp.task('sass-watch', function() {
			gulp.watch(SASS_DIR + "/*.scss", ["css-build"]);
		});
		/* SASS */

	gulp.task("css-build", function(callback) {
		sequence(["sass-compile", "css-all-in-one"])(callback);
	});
	gulp.task("css-clean-build", sequence(["css-clean", "css-min-clean", "css-build"]));
	/* CSS */

	/* JS */
	gulp.task('js-clean', function() {
	  return gulp.src(JS_DIR + "/*.min.js", {read: false})
		.pipe(clean());
	});
	
	gulp.task('js-minify', function() {
	  return gulp.src([JS_DIR + "/*.js", "!" + JS_DIR + "/*.min.js"])
		.pipe(minify({
			ext: {
				min: ".min.js"
			}
		}))
		.pipe(gulp.dest(JS_DIR))
	});
	
	gulp.task('js-all-in-one', function() {
	  return gulp.src([JS_DIR + "/*.min.js", "!" + JS_DIR + "/all.min.js"])
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest(JS_DIR));
	});
	
	// gulp.task("js-lint", function() {
		
	// });
	
	gulp.task('js-watch', function() {
		gulp.watch(JS_DIR + "/*.js", ["js-build"]);
	});

	gulp.task("js-build", function(callback) {
		sequence(["js-minify", "js-all-in-one"])(callback);
	});
	gulp.task("js-clean-build", sequence(["js-clean", "js-build"]));
	/* JS */

	/* COMMONS */
	
	gulp.task('watch', function() {
		gulp.watch([
			SASS_DIR + "/*.scss", 
			JS_DIR + "/*.js"
		], ["clean-build"]);
	});
	
	gulp.task("clean", ["css-clean", "js-clean"]);

	gulp.task("build", ["css-build", "js-build"]);

	gulp.task("clean-build", function(callback) {
		sequence(["clean" , "build"])(callback);
	});
	
	gulp.task("default", ["clean-build"]);
	/* COMMONS */

/* TASKS */