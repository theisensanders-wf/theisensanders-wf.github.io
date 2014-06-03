var gulp = require('gulp'),
    express = require('express'),
    sass = require('gulp-sass'),
    spawn = require('child_process').spawn,
    livereload = require('gulp-livereload');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = '_site/'


// Run Jekyll Build Asynchronously
gulp.task('jekyll', function () {
    var jekyll = spawn('jekyll', ['build']);

    jekyll.on('exit', function (code) {
        console.log('-- Finished Jekyll Build --')
    })
});


// Compile SASS
gulp.task('sass:dev', function () {
    return gulp.src('assets/_scss/*.scss')
        .pipe(sass({'sourceComments': 'map'})) // Turn on source mapping
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('_site/assets/css')); // Copy to static dir
});

gulp.task('sass:prod', function () {
    return gulp.src('assets/_scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/css'))
});


// Run static file server
gulp.task('serve', function () {
    var server = express();
    server.use(express.static(EXPRESS_ROOT));
    server.listen(EXPRESS_PORT);
});


// Watch for changes
gulp.task('watch', function () {
    var lr = livereload();

    gulp.watch('assets/_scss/*.scss', ['sass:dev']);
    gulp.watch(['*.html', '*/*.html', '*/*.md', '!_site/**', '!_site/*/**'], ['jekyll']);

    gulp.watch(['_site/*/**']).on('change', function (file) {
        lr.changed(file.path);
    });
})


gulp.task('dev', ['sass:dev', 'jekyll', 'serve', 'watch']);
gulp.task('prod', ['sass:prod']);
gulp.task('default', ['dev']);
