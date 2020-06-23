const SRC_DIR = './src/',
    DIST_DIR = './dist/',
    DIST_FILES = DIST_DIR + '**'; //dist目录下所有文件

const CONFIG = {
    src: SRC_DIR,
    dist: DIST_DIR,
    dist_files: DIST_FILES,
    html: {
        dir: SRC_DIR + 'html',
        src: SRC_DIR + '**/*.html',
        dist: DIST_DIR
    },
    sass: {
        dir: SRC_DIR + 'sass',
        src: SRC_DIR + 'sass/**/*.scss',
        dist: DIST_DIR + 'css'
    },
    js: {
        dir: SRC_DIR + 'js',
        src: SRC_DIR + 'js/**/*.js',
        dist: DIST_DIR + 'js',
        build_name: 'build.js' //合并后的js文件名
    },
    img: {
        dir: SRC_DIR + 'images',
        src: SRC_DIR + "images/**/*",
        dist: DIST_DIR + 'images'
    },
    assets: {
        dir: SRC_DIR + 'assets',
        src: SRC_DIR + "assets/**/*",
        dist: DIST_DIR + 'assets'
    }
}

module.exports = CONFIG;