// Import gulp and plugins
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// File paths
const files = {
  scssPath: 'Frontend/Src/scss/**/*.scss',
  jsPath: 'Frontend/Src/js/**/*.js',
  imgPath: 'Frontend/Src/images/**/*'
};

// Sass task: compiles the style.scss file into style.css
function styles() {
  return gulp.src(files.scssPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer('last 2 versions'), cssnano()]))
    .pipe(gulp.dest('Frontend/Dist/css/'))
    .pipe(browserSync.stream());
}

// JS task: concatenates and uglifies JS files to script.js
function scripts() {
  return gulp.src(files.jsPath)
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Frontend/Dist/js/'))
    .pipe(browserSync.stream());
}

// Image task: optimizes images
function images() {
  return gulp.src(files.imgPath)
    .pipe(imagemin())
    .pipe(gulp.dest('Frontend/Dist/images/'));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run the respective task and reload the browser
function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(files.scssPath, styles);
  gulp.watch(files.jsPath, scripts);
  gulp.watch(files.imgPath, images);
  gulp.watch('./*.html').on('change', browserSync.reload);
}

// Export the tasks
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;

// Default task: runs all tasks and starts watch
exports.default = gulp.series(styles, scripts, images, watch);
