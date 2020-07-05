const gulp = require('gulp')
const webpack = require('webpack-stream')
const sass = require('gulp-sass')
const gulpIf = require('gulp-if')
const autoprefixer = require('autoprefixer')
const cleanCss = require('gulp-clean-css')
const postCss = require('gulp-postcss')

const NODE_ENV = process.env.NODE_ENV || 'development'
let dest

if (NODE_ENV === 'development') {
  dest = 'C:/Open/OSPanel/domains/some.landing/admin'
} else {
  dest = './build'
}

gulp.task('js', () => {
  return gulp.src('./src/main.js')
    .pipe(webpack({
      mode: NODE_ENV,
      output: {
        filename: 'script.js'
      },
      devtool: NODE_ENV === 'development' ? 'source-map' : false,
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    debug: NODE_ENV === 'development',
                    corejs: 3,
                    useBuiltIns: 'usage'
                  }],
                  ['@babel/react']
                ]
              }
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(dest))
})

gulp.task('scss', () => {
  return gulp.src('./src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(NODE_ENV === 'production', postCss([
      autoprefixer
    ])))
    .pipe(gulpIf(NODE_ENV === 'production', cleanCss()))
    .pipe(gulp.dest(dest))
})

gulp.task('html', () => {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest(dest))
})

gulp.task('api', () => {
  gulp.src('./api/**/.*')
    .pipe(gulp.dest(dest + '/api'))

  return gulp.src('./api/**/*.*')
    .pipe(gulp.dest(dest + '/api'))
})

gulp.task('assets', () => {
  return gulp.src('./assets/**/*.*')
    .pipe(gulp.dest(dest + '/assets'))
})

gulp.task('watch', () => {
  gulp.watch('./src/index.html', gulp.parallel('html'))
  gulp.watch('./src/**/*.scss', gulp.parallel('scss'))
  gulp.watch('./src/**/*.js', gulp.parallel('js'))
  gulp.watch('./api/**/*.*', gulp.parallel('api'))
  gulp.watch('./assets/**/*.*', gulp.parallel('assets'))
})

gulp.task('dev', gulp.parallel('html', 'scss', 'js', 'api', 'assets'))

gulp.task('build', gulp.parallel('html', 'api', 'assets', 'js', 'scss'))

gulp.task('default', gulp.series('dev', 'watch'))
