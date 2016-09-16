var gulp = require('gulp');
var ts = require('gulp-typescript');
var war = require('gulp-war');
var install = require('gulp-install');
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');

gulp.task('install_deps', function(done) {
    gulp.src(['package.json'])
        .pipe(gulp.dest('./build/web'))
        .pipe(install({production: true}))
        .on('end', function() {
            done()
        })
        .resume();
});

gulp.task('typescript', ['install_deps'], function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'all.js'
        }))
        .pipe(gulp.dest('./build/web'));
});

gulp.task('uglify', ['typescript'], function() {
    return gulp.src('./build/web/all.js')
        .pipe(uglify({
            mangle: true,
            compress: true
        }))
        .pipe(gulp.dest('./build/web/'))
        .resume();
})

gulp.task('war', ['typescript'], function() {
    return gulp.src('./build/web/**/*')
        .pipe(war({
            welcome: 'index.html',
            displayName: 'this is a display name'
        }))
        .pipe(zip('web-dependencies.war'))
        .pipe(gulp.dest("./build/libs"));
});

gulp.task('build', ['install_deps', 'typescript', 'uglify', 'war']);