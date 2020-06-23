var gulp = require('gulp'),
    config = require('./gulpfile.config.js'), //路径配置文件
    sourcemaps = require('gulp-sourcemaps') //文件映射

var browserSync = require('browser-sync').create(), //实时刷新初始化
    reload = browserSync.reload;

var plumber = require('gulp-plumber'), //代码报错
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'), //添加前缀
    eslint = require('gulp-eslint'), //js代码检查
    babel = require('gulp-babel') //编译es6

var browserify = require('browserify'), //解析模块化
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream')

var imagemin = require('gulp-imagemin'), //图片压缩
    pngquant = require('imagemin-pngquant'), //png图片压缩
    base64 = require('gulp-base64')


function dev() {
    //html只做拷贝
    gulp.task('html:dev', () => {
        return gulp.src(config.html.src)
            .pipe(gulp.dest(config.html.dist))
            .pipe(reload({
                stream: true
            }))
    })
    //第三方文件，只做拷贝
    gulp.task('assets:dev', () => {
        return gulp.src(config.assets.src)
            .pipe(gulp.dest(config.assets.dist))
    })
    //sass 编译为css 添加前缀 映射关系
    gulp.task('sass:dev', () => {
        return gulp.src(config.sass.src)
            .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['last 5 versions']
            }))
            .pipe(base64({
                maxImageSize: 5 * 1024 // 1024b = 1kb  10kb一下图片
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.sass.dist))
            .pipe(reload({
                stream: true
            }))
    })

    //模块化处理 browserify
    // gulp.task('js:devModule', () => {
    //     return browserify({
    //             entries: config.js.dir + '/index.js', //入口文件
    //             debug: true //内联sourcemaps
    //         })
    //         .transform([babelify, {
    //             presets: ['env']
    //         }])
    //         .bundle() //合并打包
    //         .pipe(source(config.js.build_name)) //转换为vinyl对象且重命名
    //         .pipe(buffer()) // 必须通过buffer转为stream流才能往下执行
    //         .pipe(eslint())
    //         .pipe(eslint.format())
    //         .pipe(babel())
    //         .pipe(gulp.dest(config.js.dist))
    //         .pipe(reload({
    //             stream: true
    //         }));
    // })
    //普通处理： 检查 编译es6 映射关系 浏览器监听
    gulp.task('js', () => {
        gulp.src(config.js.src)
            .pipe(sourcemaps.init())
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(babel())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.js.dist))
            .pipe(reload({
            stream: true
        }))
    })
    //图片处理  压缩
    gulp.task('img:dev', () => {
        return gulp.src(config.img.src)
            .pipe(imagemin({
                optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
                use: [pngquant()]
            }))
            .pipe(gulp.dest(config.img.dist))
    })

    gulp.task('dev', ['assets:dev', 'html:dev', 'sass:dev', 'js', 'img:dev'], () => {
        browserSync.init({ //初始化
            server: {
                baseDir: config.dist //baseDir共享目录 服务器的根目录
            },
            notify: false //不在浏览器显示任何通知
        })

        gulp.watch(config.html.src, ['html:dev'])
        gulp.watch(config.sass.src, ['sass:dev'])
        gulp.watch(config.js.src, ['js'])
    })
}

module.exports = dev;