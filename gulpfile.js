"use strict";

/* VARS */
var gulp = require('gulp');
var minify = require('gulp-minify');
var sequence = require('gulp-sequence');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
/* VARS */

/* CONSTS */
const CSS_DIR = "./css";
const JS_DIR = "./js";
const SASS_DIR = "./sass";
/* CONSTS */
 
/* TASKS */

	/* CSS */
	gulp.task('clean-css', function() {
	  return gulp.src([CSS_DIR + "/*.css", "!" + CSS_DIR + "/*.min.css"], {read: false})
		.pipe(clean());
	});
	gulp.task('clean-min-css', function() {
	  return gulp.src(CSS_DIR + "/*.min.css", {read: false})
		.pipe(clean());
	});
	
		/* SASS */
		gulp.task('sass', function () {
		  return gulp.src(SASS_DIR + "/*.scss")
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest(CSS_DIR));
		});
		/* SASS */

	gulp.task("build-css", ["sass"]);
	gulp.task("clean-build-css", sequence(["clean-css", "clean-min-css", "build-css"]));
	/* CSS */

	/* JS */
	gulp.task('clean-js', function() {
	  return gulp.src(JS_DIR + "/*.min.js", {read: false})
		.pipe(clean());
	});
	
	gulp.task('minify-js', function() {
	  return gulp.src([JS_DIR + "/*.js", "!" + JS_DIR + "/*.min.js"])
		.pipe(minify({
			ext: {
				min: ".min.js"
			}
		}))
		.pipe(gulp.dest(JS_DIR))
	});
	
	gulp.task('all-in-one-js', function() {
	  return gulp.src([JS_DIR + "/*.min.js", "!" + JS_DIR + "/all.min.js"])
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest(JS_DIR));
	});

	gulp.task("build-js", ["minify-js", "all-in-one-js"]);
	gulp.task("clean-build-js", sequence(["clean-js", "build-js"]));
	/* JS */

	/* COMMONS */
	gulp.task("clean", ["clean-css", "clean-js"]);

	gulp.task("build", ["build-css", "build-js"]);

	gulp.task("clean-build", sequence(["clean" , "build"]));
	
	gulp.task("default", sequence(["clean", "build"]));
	/* COMMONS */

/* TASKS */