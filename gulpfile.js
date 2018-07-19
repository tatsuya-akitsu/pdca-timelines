const gulp = require('gulp');
const browserSync = require('browser-sync');
const packageImporter = require('node-sass-package-importer');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const webpackConfig = require('./webpack.config.js');

const paths = {
  html: './public/',
  css: './public/css/',
  out_js: './public/js/',
  scss: './src/scss/',
  in_js: './src/js/',
};

gulp.task('sass', () => {
  gulp
    .src(`${paths.scss}**/*.scss`)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(sass({
      importer: packageImporter({
        extensions: ['.scss', '.css'],
      }),
    }));
});

gulp.task('webpack', () => webpackStream(webpackConfig, webpack).pipe(gulp.dest(paths.out_js)));

gulp.task('browser-sync', () => {
  browserSync({
    port: 3000,
    server: { baseDir: paths.html },
  });
  gulp.watch(`${paths.html}*.html`, ['reload']);
  gulp.watch(`${paths.scss}**/*.scss`, ['reload']);
  gulp.watch(`${paths.out_js}**/*.js`, ['reload']);
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('watch', () => {
  gulp.watch(`${paths.scss}**/*.scss`, ['sass']);
  gulp.watch(`${paths.in_js}**/*.js`, ['webpack']);
});

gulp.task('default', ['sass', 'webpack', 'browser-sync', 'watch']);
