var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var addsrc = require('gulp-add-src');
var cleanCSS = require('gulp-clean-css');

var config = {
    sourceDir: './src/',
    publicDir: './dist/'
};

/* Vendor Scripts task */
gulp.task('vendor_scripts', function () {
    var jsDir = config.publicDir + 'vendor/js';

    gulp.src(config.sourceDir + 'vendor/js/jquery.min.js')
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/bootstrap.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/dataTable.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/dataTable-bootstrap.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/match-height.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/moment.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/moment-with-locales.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/datetimepicker.min.js'))

        .pipe(concat('vendor-common.min.js'))
        .pipe(gulp.dest(jsDir))
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});

/* Scripts task */
gulp.task('scripts', function () {
    var jsDir = config.publicDir + '/js';

    gulp.src(config.sourceDir + '/js/*.js')
        .pipe(concat('common.min.js'))
        .pipe(gulp.dest(jsDir))
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});

/* Vendor Styles task */
gulp.task('vendor_styles', function () {
    var cssDir = config.publicDir + 'vendor/css';

    gulp.src(config.sourceDir + 'vendor/css/bootstrap.min.css')
        .pipe(addsrc.append(config.sourceDir + 'vendor/css/dataTables.bootstrap.min.css'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/css/bootstrap-datetimepicker.min.css'))

        .pipe(concat('vendor-styles.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDir))
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

 gulp.task('default', ['scripts', 'styles', 'vendor_scripts', 'vendor_styles']);
