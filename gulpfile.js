var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');

var config = {
    sourceDir: './src/',
    publicDir: './dist/'
};

/* Scripts task */
gulp.task('scripts', function () {
    var jsDir = config.publicDir + '/js';

    gulp.src(config.sourceDir + '/js/*.js')
        .pipe(concat('common.js'))
        .pipe(gulp.dest(jsDir))
        .pipe(rename('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});

/* Styles task */
gulp.task('styles', function () {
    var cssDir = config.publicDir + '/css';

    gulp.src(config.sourceDir + '/css/*.css')
        .pipe(autoprefixer())
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDir))
});

 gulp.task('default', ['scripts', 'styles']);
