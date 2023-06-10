const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
//const htmlValid = require('gulp-w3c-html-validator')
//const bemValid = require('gulp-html-bem-validator')
const browserSync = require('browser-sync').create()
const clean = require('gulp-clean');
const gulpPug = require('gulp-pug')

const puti = {
    pug: {
        src: 'src/pages/*.pug',
        dest: 'build'
    },

    scss: {
        src: 'src/scss/*.scss',
        dest: 'build/css'
    }
}

function cleaner() {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
}

function browsersync() {
    browserSync.init({
            open: true,
            server: 'build'
    });
} 

function pug() {
    return gulp.src(puti.pug.src)
        .pipe(gulpPug({
           pretty: true
        }))
        .pipe(gulp.dest(puti.pug.dest)) 
        .on('end', browserSync.reload)
    }

function styles() {
    return gulp.src(puti.scss.src)
        .pipe(sass())
        .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], grid: true })) 
        .pipe(concat('main.css'))
        .pipe(gulp.dest(puti.scss.dest)) 
        .pipe(browserSync.stream())
    }

function watcher () {
    gulp.watch('src/pages/**/*.pug', pug);
}


exports.pug = pug;
//exports.default = gulp.series(cleaner, pug, styles, browsersync, watch);

exports.default = gulp.series(
    gulp.parallel(cleaner),
    gulp.parallel(pug, styles),
    gulp.parallel(browsersync, watcher)
);