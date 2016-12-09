

/* CONSTS */
const clean = require("gulp-clean"),
	concat = require("gulp-concat"),
	cssDeclarationSorter = require("css-declaration-sorter"),
	eslint = require("gulp-eslint"),
	gulp = require("gulp"),
	gulpIf = require("gulp-if"),
	minifyCSS = require("gulp-clean-css"),
	minifyJS = require("gulp-minify"),
	postCSS = require("gulp-postcss"),
	rename = require("gulp-rename"),
	sass = require("gulp-sass"),
	sassLint = require("gulp-sass-lint"),
	sequence = require("gulp-sequence"),
	server = require("gulp-server-livereload");


const DIST_DIR = "./dist",
	SRC_DIR = "./src";

const
	// CSS_SRC_DIR = SRC_DIR + "/css",
	CSS_DIST_DIR = DIST_DIR + "/css",
	JS_DIST_DIR = DIST_DIR + "/js",
	JS_SRC_DIR = SRC_DIR + "/js",
	SASS_SRC_DIR = SRC_DIR + "/sass";
/* CONSTS */

/* UTIL */
const isFixed = function (file) {

    return file.eslint !== null && file.eslint.fixed;

};
/* UTIL */

/* CSS */
gulp.task("css:clean", function () {

  return gulp.src(CSS_DIST_DIR, {"read": false})
	.pipe(clean());

});

gulp.task("css:minify", function () {

  return gulp.src([
		CSS_DIST_DIR + "/**/*.css",
		"!" + CSS_DIST_DIR + "/**/*.min.css"
	])
	.pipe(minifyCSS({
		"compatibility": "ie8"
	}))
	.pipe(rename({
		"suffix": ".min"
	}))
	.pipe(gulp.dest(CSS_DIST_DIR));

});

gulp.task("css:format", function () {

  return gulp.src([
		CSS_DIST_DIR + "/**/*.css",
		"!" + CSS_DIST_DIR + "/**/*.min.css"
	])
    .pipe(postCSS([cssDeclarationSorter({"order": "smacss"})]))
    .pipe(gulp.dest(CSS_DIST_DIR));

});

gulp.task("css:all-in-one", function () {

  return gulp.src([
		CSS_DIST_DIR + "/**/*.css",
		"!" + CSS_DIST_DIR + "/**/*.min.css",
		"!" + CSS_DIST_DIR + "/all.css"
	])
	.pipe(concat("all.css"))
	.pipe(gulp.dest(CSS_DIST_DIR));

});

gulp.task("css:min-all-in-one", function () {

  return gulp.src([
		CSS_DIST_DIR + "/**/*.min.css",
		"!" + CSS_DIST_DIR + "/all.min.css"
	])
	.pipe(concat("all.min.css"))
	.pipe(gulp.dest(CSS_DIST_DIR));

});

gulp.task("css:build", function (callback) {

	sequence(
		"sass:lint",
		"sass:compile",
		"css:format",
		"css:minify",
		"css:all-in-one",
		"css:min-all-in-one"
	)(callback);

});
gulp.task("css:clean+build", sequence("css:clean", "css:build"));
/* CSS */

/* SASS */
gulp.task("sass:compile", function () {

  return gulp.src(SASS_SRC_DIR + "/**/*.scss")
	.pipe(sass().on("error", sass.logError))
	.pipe(gulp.dest(CSS_DIST_DIR));

});

gulp.task("sass:lint", function () {

  return gulp.src(SASS_SRC_DIR + "/**/*.scss")
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());

});

gulp.task("sass:watch", function () {

	gulp.watch(SASS_SRC_DIR + "/**/*.scss", ["css:build"]);

});
/* SASS */

/* JS */
gulp.task("js:clean", function () {

  return gulp.src(JS_DIST_DIR, {"read": false})
	.pipe(clean());

});

gulp.task("js:eslint", function () {

  return gulp.src([
		JS_SRC_DIR + "/**/*.js",
		"!" + JS_SRC_DIR + "/**/*.min.js"
	])
	.pipe(eslint({
		"fix": true
	}))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
	.pipe(gulpIf(isFixed, gulp.dest(JS_SRC_DIR)));

});

gulp.task("js:minify", function () {

  return gulp.src([
		JS_SRC_DIR + "/**/*.js",
		"!" + JS_SRC_DIR + "/**/*.min.js",
		"!" + JS_SRC_DIR + "/**/all.js"
	])
	.pipe(minifyJS({
		"ext": {
			"min": ".min.js"
		}
	}))
	.pipe(gulp.dest(JS_DIST_DIR));

});

gulp.task("js:min-all-in-one", function () {

  return gulp.src([
		JS_SRC_DIR + "/**/*.min.js",
		"!" + JS_SRC_DIR + "/all.min.js"
	])
	.pipe(concat("all.min.js"))
	.pipe(gulp.dest(JS_DIST_DIR));

});

gulp.task("js:all-in-one", function () {

  return gulp.src([
		JS_SRC_DIR + "/**/*.js",
		"!" + JS_SRC_DIR + "/**/*.min.js",
		"!" + JS_SRC_DIR + "/**/all.js"
	])
	.pipe(concat("all.js"))
	.pipe(gulp.dest(JS_DIST_DIR));

});

gulp.task("js:watch", function () {

	gulp.watch(JS_SRC_DIR + "/**/*.js", ["js:build"]);

});

gulp.task("js:build", function (callback) {

	sequence("js:eslint", "js:all-in-one")(callback);

});
gulp.task("js:clean+build", sequence("js:clean", "js:build"));
/* JS */

/* GULP */
gulp.task("gulp:eslint", function () {

  return gulp.src("./gulpfile.js")
	.pipe(eslint({
		"fix": true
	}))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
	.pipe(gulpIf(isFixed, gulp.dest("./")));

});
/* GULP */

/* COMMONS */

gulp.task("webserver", ["watch"], function () {

  gulp.src(".")
    .pipe(server({
      "livereload": {
		"enable": true,
		"filter": function (filename, cb) {

		  return cb("!/\.(sa|le)ss$|node_modules/");

		}
	  },
      "directoryListing": false,
      "open": true,
	  "fallback": "index.html",
	  "defaultFile": "index.html"
    }));

});

gulp.task("watch", function watch () {

	gulp.watch([
		SASS_SRC_DIR + "/**/*.scss",
		JS_SRC_DIR + "/**/*.js"
	], ["clean+build"]);

});

gulp.task("clean", ["css:clean", "js:clean"]);

gulp.task("build", ["css:build", "js:build"]);

gulp.task("clean+build", function (callback) {

	sequence("clean", "build")(callback);

});

gulp.task("default", ["clean+build"]);
/* COMMONS */
