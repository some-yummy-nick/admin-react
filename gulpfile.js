const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass");

const dest = "C:/Open/OSPanel/domains/some.landing/admin";

gulp.task("copy-html", () => {
    return gulp.src("./src/index.html")
        .pipe(gulp.dest(dest))
});

gulp.task("build-js", () => {
    return gulp.src("./src/main.js")
        .pipe(webpack({
            mode: "development",
            output: {
                filename: "script.js"
            },
            watch: false,
            devtool: "source-map",
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
                                        debug: true,
                                        corejs: 3,
                                        useBuiltIns: "usage"
                                    }],
                                    ["@babel/react"]
                                ]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(dest))
});

gulp.task("build-scss", () => {
    return gulp.src("./src/scss/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(dest))
});

gulp.task("copy-api", () => {
    return gulp.src("./api/**/*.*")
        .pipe(gulp.dest(dest + "/api"))
});

gulp.task("copy-assets", () => {
    return gulp.src("./assets/**/*.*")
        .pipe(gulp.dest(dest + "/assets"))
});
gulp.task("watch", () => {
    gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch("./src/scss/**/*.scss", gulp.parallel("build-scss"));
    gulp.watch("./src/**/*.js", gulp.parallel("build-js"));
    gulp.watch("./api/**/*.*", gulp.parallel("copy-api"));
    gulp.watch("./assets/**/*.*", gulp.parallel("copy-assets"));
});

gulp.task("build", gulp.parallel("copy-html", "build-scss", "build-js", "copy-api", "copy-assets"));

gulp.task("default", gulp.series("build", "watch"));
