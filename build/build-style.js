const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// 编译less
gulp.task('css', function () {
    gulp.src('../src/styles/index.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie > 8']
        }))
        .pipe(cleanCSS())
        .pipe(rename('iview.css'))
        .pipe(gulp.dest('../dist/styles'));
});

gulp.task('theme', function () {
    ['green','blue','colorE','cyan-arctic','green-olive','lightBlue','purple','red-strawberry','yellow-fawn'].forEach(function (item) {
        gulp.src('../src/theme/'+item+'/index.less')
            .pipe(less())
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie > 8']
            }))
            .pipe(cleanCSS())
            .pipe(rename('iview-'+item+'.css'))
            .pipe(gulp.dest('../dist/styles'));
    })

});


// 拷贝字体文件
gulp.task('fonts', function () {
    gulp.src('../src/styles/common/iconfont/fonts/*.*')
        .pipe(gulp.dest('../dist/styles/fonts'));
});

gulp.task('default', ['css', 'fonts', 'theme']);
