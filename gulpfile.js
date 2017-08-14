var gulp = require ("gulp");
var server = require("browser-sync").create();

var sass = require("gulp-sass");
var plumber  = require ("gulp-plumber");
var postcss = require ("gulp-postcss");
var autoprefixer = require("autoprefixer");
var flexibility = require('postcss-flexibility');
var rigger = require("gulp-rigger");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");
var run = require("run-sequence");

gulp.task('style', function(){
  gulp.src("sass/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer(),
    flexibility
  ]))
  .pipe(gulp.dest("build/css"))

  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))

  .pipe(server.stream());
});

gulp.task('js-concat', function(){
  gulp.src("js/main.js")
  .pipe(rigger())
  .pipe(gulp.dest("build/scripts"));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
   ]))

  .pipe(gulp.dest("build/img"));
});


gulp.task("serve", function(){
  server.init({
    server:"build/"
  });
  gulp.watch("sass/**/*.scss", ["style"]);
  gulp.watch("*.html", ["html:update"])
  gulp.watch("js/**/*.js", ["js-concat"])
  .on("change", server.reload);
});

gulp.task("html:copy",function(){
  return gulp.src("*.html")
  .pipe(gulp.dest("build"));
});
gulp.task("html:update",["html:copy"], function(done){
  server.reload();
  done();
});

gulp.task("build", function(fn) {
 run(
 "clean",
 "copy",
 "style",
 "js-concat",
 "images",
 fn
 );
});
gulp.task("copy", function(){
  return gulp.src([
   "fonts/**/*.{woff,woff2}",
   "img/**",
   "scripts/**",
   "*.html"
   ], {
   base: "."
   })
 .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
 return del("build");
});
