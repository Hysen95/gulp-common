"use strict";

/* VARS */
var gulp = require('gulp');
var minifyJS = require('gulp-minify');
var sequence = require('gulp-sequence');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
/* VARS */

/* CONSTS */
const SRC_DIR = "./src";
const JS_SRC_DIR = SRC_DIR + "/js";
const SASS_SRC_DIR = SRC_DIR + "/sass";

const DIST_DIR = "./dist";
const CSS_DIST_DIR = DIST_DIR + "/css";
const JS_DIST_DIR = DIST_DIR + "/js";
/* CONSTS */

/* CSS */
gulp.task('css:clean', function() {
  return gulp.src(CSS_DIST_DIR, {read: false})
	.pipe(clean());
});

gulp.task('css:minify', function() {
  return gulp.src([CSS_DIST_DIR + "/*.css", "!" + CSS_DIST_DIR + "/*.min.css"])
	.pipe(minifyCSS({
		compatibility: 'ie8'
	}))
	.pipe(rename({
		suffix: ".min"
	}))
	.pipe(gulp.dest(CSS_DIST_DIR));
});
	
gulp.task('css:all-in-one', function() {
  return gulp.src([CSS_DIST_DIR + "/*.min.css", "!" + CSS_DIST_DIR + "/all.min.css"])
	.pipe(concat('all.min.css'))
	.pipe(gulp.dest(CSS_DIST_DIR));
});

gulp.task("css:build", function(callback) {
	sequence("sass:compile", "css:minify", "css:all-in-one")(callback);
});
gulp.task("css:clean-build", sequence("css:clean", "css:build"));
/* CSS */

/* SASS */
gulp.task('sass:compile', function () {
  return gulp.src(SASS_SRC_DIR + "/*.scss")
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(CSS_DIST_DIR));
});

gulp.task('sass:watch', function() {
	gulp.watch(SASS_SRC_DIR + "/*.scss", ["css:build"]);
});
/* SASS */

/* JS */
gulp.task('js:clean', function() {
  return gulp.src(JS_DIST_DIR, {read: false})
	.pipe(clean());
});

gulp.task('js:minify', function() {
  return gulp.src([JS_SRC_DIR + "/*.js", "!" + JS_SRC_DIR + "/*.min.js"])
	.pipe(minifyJS({
		ext: {
			min: ".min.js"
		}
	}))
	.pipe(gulp.dest(JS_DIST_DIR))
});

gulp.task('js:all-in-one', function() {
  return gulp.src([JS_DIST_DIR + "/*.min.js", "!" + JS_DIST_DIR + "/all.min.js"])
	.pipe(concat('all.min.js'))
	.pipe(gulp.dest(JS_DIST_DIR));
});

gulp.task('js:watch', function() {
	gulp.watch(JS_SRC_DIR + "/*.js", ["js-build"]);
});

gulp.task("js:build", function(callback) {
	sequence("js:minify", "js:all-in-one")(callback);
});
gulp.task("js:clean-build", sequence("js:clean", "js:build"));
/* JS */

/* COMMONS */
gulp.task('watch', function() {
	gulp.watch([
		SASS_SRC_DIR + "/*.scss", 
		JS_SRC_DIR + "/*.js"
	], ["clean-build"]);
});

gulp.task("clean", ["css:clean", "js:clean"]);

gulp.task("build", ["css:build", "js:build"]);

gulp.task("clean-build", function(callback) {
	sequence("clean" , "build")(callback);
});

gulp.task("default", ["clean-build"]);
/* COMMONS */