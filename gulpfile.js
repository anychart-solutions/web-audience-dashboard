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

/* Scripts task */
gulp.task('scripts', function () {
    var jsDir = config.publicDir + 'js';

    gulp.src(config.sourceDir + 'vendor/js/jquery.min.js')
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/bootstrap.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/jquery.dataTables.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/dataTables.bootstrap.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/jquery.matchHeight-min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/moment.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/moment-with-locales.min.js'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/js/bootstrap-datetimepicker.min.js'))
        .pipe(addsrc.append(config.sourceDir + '/js/detect-user-agent.js'))
        .pipe(addsrc.append(config.sourceDir + '/js/detect-device.js'))
        .pipe(addsrc.append(config.sourceDir + '/js/common.js'))

        .pipe(concat('common.min.js'))
        .pipe(gulp.dest(jsDir))
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});

/* Styles task */
gulp.task('styles', function () {
    var cssDir = config.publicDir + 'css';

    gulp.src(config.sourceDir + 'vendor/css/bootstrap.min.css')
        .pipe(addsrc.append(config.sourceDir + 'vendor/css/bootstrap.min.css'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/css/glyphicons.css'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/css/dataTables.bootstrap.min.css'))
        .pipe(addsrc.append(config.sourceDir + 'vendor/css/bootstrap-datetimepicker.min.css'))
        .pipe(addsrc.append(config.sourceDir + 'css/style.css'))
        .pipe(autoprefixer())
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDir))
});

gulp.task('default', ['scripts', 'styles']);
