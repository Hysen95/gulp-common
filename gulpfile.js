
/* CONSTS */
const babel = require("gulp-babel"),
	clean = require("gulp-clean"),
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

const CSS_DIST_DIR = DIST_DIR + "/css",
	JS_DIST_DIR = DIST_DIR + "/js",
	JS_SRC_DIR = SRC_DIR + "/js",
	SASS_SRC_DIR = SRC_DIR + "/sass";
/* CONSTS */

/* UTIL */
const isFixed = (file) => file.eslint !== null && file.eslint.fixed;
/* UTIL */

/* CSS */
gulp.task(
	"css:clean",
	() =>
		gulp.src(CSS_DIST_DIR, {"read": false}).pipe(clean())
);

gulp.task(
	"css:minify",
	() =>
		gulp.src([
			CSS_DIST_DIR + "/**/*.css",
			"!" + CSS_DIST_DIR + "/**/*.min.css"
		])
		.pipe(minifyCSS({
			"compatibility": "ie8"
		}))
		.pipe(rename({
			"suffix": ".min"
		}))
		.pipe(gulp.dest(CSS_DIST_DIR))
);

gulp.task(
	"css:format",
	() =>
		gulp.src([
			CSS_DIST_DIR + "/**/*.css",
			"!" + CSS_DIST_DIR + "/**/*.min.css"
		])
	  .pipe(postCSS([cssDeclarationSorter({"order": "smacss"})]))
	  .pipe(gulp.dest(CSS_DIST_DIR))
);

gulp.task(
	"css:all-in-one",
	() =>
	  gulp.src([
			CSS_DIST_DIR + "/**/*.css",
			"!" + CSS_DIST_DIR + "/**/*.min.css",
			"!" + CSS_DIST_DIR + "/all.css"
		])
		.pipe(concat("all.css"))
		.pipe(gulp.dest(CSS_DIST_DIR))
);

gulp.task(
	"css:min-all-in-one",
	() =>
	  gulp.src([
			CSS_DIST_DIR + "/**/*.min.css",
			"!" + CSS_DIST_DIR + "/all.min.css"
		])
		.pipe(concat("all.min.css"))
		.pipe(gulp.dest(CSS_DIST_DIR))
);

gulp.task(
	"css:build",
	(callback) => {
		sequence(
			"sass:lint",
			"sass:compile",
			"css:format",
			"css:minify",
			"css:all-in-one",
			"css:min-all-in-one"
		)(callback);
	}
);

gulp.task(
	"css:clean+build",
	sequence("css:clean", "css:build")
);
/* CSS */

/* SASS */
gulp.task(
	"sass:compile",
	() =>
	  gulp.src(SASS_SRC_DIR + "/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest(CSS_DIST_DIR))
);

gulp.task(
	"sass:lint",
	() =>
	  gulp.src(SASS_SRC_DIR + "/**/*.scss")
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
);

gulp.task(
	"sass:watch",
	() => {
		gulp.watch(SASS_SRC_DIR + "/**/*.scss", ["css:build"]);
	}
);
/* SASS */

/* JS */
gulp.task(
	"js:clean",
	() => {
	  gulp.src(JS_DIST_DIR, {"read": false})
		.pipe(clean());
	}
);

gulp.task(
	"js:compile",
	() =>
		gulp.src([
				JS_SRC_DIR + "/**/*.js",
				"!" + JS_SRC_DIR + "/**/*.min.js"
		])
		.pipe(babel({
			"presets": ["es2015"]
		}))
		.pipe(
			gulp.dest(JS_DIST_DIR)
		)
);

gulp.task(
	"js:eslint",
	() =>
	  gulp.src([
			JS_SRC_DIR + "/**/*.js",
			"!" + JS_SRC_DIR + "/**/*.min.js"
		])
		.pipe(eslint({
			"fix": true
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(gulpIf(isFixed, gulp.dest(JS_SRC_DIR)))
);

gulp.task(
	"js:minify",
	() =>
	  gulp.src([
			JS_DIST_DIR + "/**/*.js",
			"!" + JS_DIST_DIR + "/**/*.min.js"
		])
		.pipe(minifyJS({
			"ext": {
				"min": ".min.js"
			}
		}))
		.pipe(gulp.dest(JS_DIST_DIR))
);

gulp.task(
	"js:min-all-in-one",
	() =>
		gulp.src([
			JS_DIST_DIR + "/**/*.min.js",
			"!" + JS_DIST_DIR + "/all.min.js"
		])
		.pipe(concat("all.min.js"))
		.pipe(gulp.dest(JS_DIST_DIR))
);

gulp.task(
	"js:all-in-one",
	() =>
	  gulp.src([
			JS_DIST_DIR + "/**/*.js",
			"!" + JS_DIST_DIR + "/**/*.min.js",
			"!" + JS_DIST_DIR + "/**/all.js"
		])
		.pipe(concat("all.js"))
		.pipe(gulp.dest(JS_DIST_DIR))
);

gulp.task(
	"js:watch",
	() => {
		gulp.watch(JS_SRC_DIR + "/**/*.js", ["js:build"])
	}
);

gulp.task("js:build", (callback) => {
	sequence("js:eslint", "js:compile", "js:all-in-one", "js:minify")(callback);
});

gulp.task("js:clean+build", sequence("js:clean", "js:build"));
/* JS */

/* GULP */
gulp.task(
	"gulp:eslint",
	() =>
	  gulp.src("./gulpfile.js")
		.pipe(eslint({
			"fix": true
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(gulpIf(isFixed, gulp.dest("./")))
);

gulp.task("gulp:watch", () => {

	gulp.watch(
		["./gulpfile.js"],
		["gulp:eslint"]
	);

});
/* GULP */

/* COMMONS */
gulp.task(
	"webserver",
	["watch"],
	() => {
	  gulp.src(".")
	  .pipe(
			server({
		    "livereload": {
					"enable": true,
					"filter": (filename, cb) => cb("!/\.(sa|le)ss$|node_modules/")
		  	},
		    "directoryListing": false,
		    "open": true,
			  "fallback": "index.html",
			  "defaultFile": "index.html"
		  })
		);
	}
);

gulp.task(
	"watch",
	() => {
		gulp.watch([
			SASS_SRC_DIR + "/**/*.scss",
			JS_SRC_DIR + "/**/*.js"
		], ["clean+build"]);
	}
);

gulp.task(
	"clean",
	["css:clean", "js:clean"]
);

gulp.task(
	"build",
	["css:build", "js:build"]
);

gulp.task(
	"clean+build",
	(callback) => {
		sequence("clean", "build")(callback);
	}
);

gulp.task(
	"default",
	["clean+build"]
);
/* COMMONS */
