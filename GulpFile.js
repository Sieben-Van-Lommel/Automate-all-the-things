// Import gulp and plugins
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sharp = require('gulp-sharp-responsive');
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

// Optimize PNG images using sharp
function optimizePng() {
  return gulp.src('Frontend/Src/images/**/*.png')
    .pipe(sharp({
      formats: [
        {
          format: 'png',
          width: 1024,
          pngOptions: {
            quality: 80,
            progressive: true,
            compressionLevel: 9,
            effort: 10,
          },
        },
      ],
    }))
    .pipe(gulp.dest('Frontend/Dist/images/'))
    .pipe(browserSync.stream());
}

// Optimize other images with imagemin
function images() {
  return gulp.src('Frontend/Src/images/**/*.{jpg,jpeg,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('Frontend/Dist/images'))
    .pipe(browserSync.stream());
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
  gulp.watch('Frontend/Src/images/**/*.png', optimizePng); // Watch PNG images for optimization
  gulp.watch('Frontend/Src/images/**/*.{jpg,jpeg,gif,svg}', images); // Watch other images
  gulp.watch('./*.html').on('change', browserSync.reload);
}

// Export the tasks
exports.styles = styles;
exports.scripts = scripts;
exports.optimizePng = optimizePng;
exports.images = images;
exports.watch = watch;

// Default task: runs all tasks and starts watch
exports.default = gulp.series(styles, scripts, optimizePng, images, watch);
