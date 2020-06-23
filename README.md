#Glup自动化构建工具
  1. 只有简单的sass编译和浏览器监听，未做文件压缩、合并、等功能
  2. 打包后的dist文件和开发环境中的src文件没有本质区别，只是复制的效果,只有css是通过sass编译的

#目录结构
--build
  --配置文件
--dist
  --assets    //静态资源，一般为引入的插件和库
  --html      //其它html文件
  --js        //原生js
  --css       //编译后的css
  index.html  //首页
--src
  --assets    //静态资源，一般为引入的插件和库
  --html      //其它html文件
  --js        //原生js
  --sass      //原生sass
  index.html  //首页