var gulp = require('gulp'),
    config = require('./gulpfile.config.js'), //路径配置文件
    autoprefixer = require('gulp-autoprefixer'), //添加前缀
    sass = require('gulp-sass'),
    eslint = require('gulp-eslint'), //js代码检查
    babel = require('gulp-babel'), //编译es6
    sourcemaps = require('gulp-sourcemaps'), //文件映射
    imagemin = require('gulp-imagemin'), //图片压缩
    pngquant = require('imagemin-pngquant') //png图片压缩

var browserify = require('browserify'), //解析模块化
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream')

var cleanCss = require('gulp-clean-css'), //css压缩
    base64 = require('gulp-base64'), //将小图片直接转译成编码
    rename = require('gulp-rename'), //修改文件名
    rev = require('gulp-rev'), //文件名加MD5后缀
    revCollector = require('gulp-rev-collector'), //执行文件内css名的替换
    concat = require('gulp-concat'), //合并文件
    uglify = require('gulp-uglify'), //文件压缩
    del = require('del') //删除文件或文件夹

function dev() {
    //html只做拷贝
    gulp.task('html:pro', () => {
        return gulp.src(config.html.src)
            .pipe(gulp.dest(config.html.dist))
    })
    //第三方文件，只做拷贝
    gulp.task('assets:pro', () => {
        return gulp.src(config.assets.src)
            .pipe(gulp.dest(config.assets.dist))
    })
    //sass 编译为css 添加前缀 映射关系
    gulp.task('sass:pro', (cb) => {
        return gulp.src(config.sass.src)
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['last 5 versions'] // 添加前缀
            }))
            .pipe(base64({
                maxImageSize: 10 * 1024 // 1024b = 1kb  10kb一下图片
            }))
            .pipe(cleanCss()) //压缩css
            .pipe(rename({
                suffix: '.min'
            })) //压缩后改名
            .pipe(rev()) //文件名加MD5后缀
            .pipe(gulp.dest(config.sass.dist))
            .pipe(rev.manifest()) //生成一个rev-manifest.json
            .pipe(gulp.dest('./src/rev'))
        // cb()
    })
    gulp.task('rev', ['sass:pro'], () => {
        return gulp.src(['./src/rev/*.json', './src/index.html'])
            .pipe(revCollector()) //执行文件内css名的替换
            .pipe(gulp.dest(config.dist))
    })
    //检查 编译es6 映射关系
    // gulp.task('js:pro', () => {
    //     return gulp.src(config.js.src)
    //         .pipe(eslint())
    //         .pipe(eslint.format())
    //         .pipe(babel({
    //             presets: ['env']
    //         }))
    //         .pipe(concat(config.js.build_name))
    //         .pipe(uglify())
    //         .pipe(rename({
    //             suffix: '.min'
    //         })) //压缩后改名
    //         .pipe(gulp.dest(config.js.dist))
    // })
    //模块化处理 browserify
    gulp.task('js:proModule', () => {
        return browserify({
                entries: config.js.dir + '/index.js', //入口文件
                debug: true //内联sourcemaps
            })
            .transform([babelify, {
                presets: ['env']
            }])
            .bundle() //合并打包
            .pipe(source(config.js.build_name)) //转换为vinyl对象且重命名
            .pipe(buffer()) // 必须通过buffer转为stream流才能往下执行
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            })) //压缩后改名
            .pipe(gulp.dest(config.js.dist))
    })
    ////图片处理  压缩
    gulp.task('img:pro', () => {
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
    // gulp.task('deldist', () => {
    //     del([
    //         config.dist + "**"
    //     ])
    // })
    // gulp.task('delsrc', () => {
    //     del([
    //         config.src + "**"
    //     ])
    // })
    gulp.task('del', () => {
        del([ config.src + "**", config.dist + "**"])
    })
    gulp.task('default', () => {
        console.log('npm run delsrc 删除src目录')
        console.log('npm run deldist  删除dist目录')
        console.log('npm run init 项目初始化')
        console.log('npm run dev  开发环境打包')
        console.log('npm run build  生产环境打包')
    })
    gulp.task('pro', ['html:pro', 'js:proModule', 'rev', 'img:pro', 'assets:pro'])
}

module.exports = dev;