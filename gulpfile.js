var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify       = require('gulp-uglify'),
    jshint       = require('gulp-jshint'),
    header       = require('gulp-header'),
    rename       = require('gulp-rename'),
    cssnano      = require('gulp-cssnano'),
    sourcemaps   = require('gulp-sourcemaps'),
    package      = require('./package.json'),
    wait         = require('gulp-wait'),
    include      = require('gulp-include'),
    babel        = require('gulp-babel');


var banner = [
  '/*!\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.description %>\n' +
  ' * \n' + 
  ' * \n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * @version <%= package.url %>\n' +
  ' * \n' +
  ' * \n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' * \n' +
  ' */\n',
].join('');

var paths = {

    appDir      : './app/',

    distCss     : './app/css/',
    distJs      : './app/js/',
    distFonts   : './app/fonts/',

    srcScss     : './src/scss/',
    srcJS       : './src/js/'

};

var sassOptions = {
    
    errLogToConsole: true,
    includePaths    : [
        paths.srcScss
    ]
}

gulp.task('css', function () {
    return gulp.src(paths.srcScss + '/main.scss')
    .pipe(wait(1500))
    //.pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    //.pipe(gulp.dest(paths.distCss))
    //.pipe(cssnano())
    .pipe(rename({ basename: "styles" }))
    .pipe(header(banner, { package : package }))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.distCss))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src([
        paths.srcJS + 'app.js'
    ])
    //.pipe(include())
    //.pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    //.pipe(header(banner, { package : package }))
    //.pipe(gulp.dest(paths.distJs))
    .pipe(babel())
    //.pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ basename: "pong-game" }))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.distJs))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: paths.appDir
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['js', 'css', 'browser-sync'], function () {
    gulp.watch(paths.srcScss + "*.scss", ['css']);
    gulp.watch(paths.srcJS   + "*.js", ['js']);
    gulp.watch(paths.appDir  + "*.html", ['bs-reload']);
});