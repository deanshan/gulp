var init = require('./build/gulpfile.init.js');
init(); //task-init
var dev = require('./build/gulpfile.dev');
dev(); //task-dev
var pro = require('./build/gulpfile.pro');
pro();