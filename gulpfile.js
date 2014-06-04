var gulp = require('gulp'),
    express = require('express'),
    clean = require('gulp-clean'),
    compass = require('gulp-compass'),
    spawn = require('child_process').spawn,
    livereload = require('gulp-livereload');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = '_site/'
var DEBUG = false;


// Run Jekyll Build Asynchronously
gulp.task('jekyll', function () {
    var jekyll = spawn('jekyll', ['build']);

    jekyll.on('exit', function (code) {
        console.log('-- Finished Async Jekyll Build --')
    })
});


// Clean out files between builds
gulp.task('clean', function () {
    return gulp.src('assets/css/*.css', {read: false})
        .pipe(clean());
});


// Compile SASS
gulp.task('sass', function () {
    return gulp.src('assets/_scss/*.scss')
        .pipe(compass({
            css: 'assets/css',
            sass: 'assets/_scss',
            image: 'assets/img',
            sourcemap: DEBUG
        }))
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('_site/assets/css')); // Copy to static dir
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

    gulp.watch(['assets/_scss/*.scss', 'assets/_scss/*/*.scss'], ['sass:dev']);
    gulp.watch(['*.html', '*/*.html', '*/*.md', '*/*.png', '!_site/**', '!_site/*/**'], ['jekyll']);

    gulp.watch(['_site/*/**']).on('change', function (file) {
        lr.changed(file.path);
    });
})



// Runners
gulp.task('build', ['clean', 'sass', 'jekyll']);

gulp.task('dev', function () {
    DEBUG = true;

    gulp.start('build');
    gulp.start('serve');
    gulp.start('watch');
})

gulp.task('default', ['build']);
