var gulp = require('gulp'),
    mkdirp = require('mkdirp'),
    config = require('./gulpfile.config.js')

function init() {
    gulp.task('init', () => {
        var dirs = [config.src,
            // config.html.dir,
            config.js.dir, config.sass.dir, config.assets.dir, config.img.dir];
        for (var values of dirs) {
            mkdirp.sync(values); //创建文件夹
        }
    })
}

module.exports = init;