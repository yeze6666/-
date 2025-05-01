module.exports = {
    publicPath: './',
    css: {
      loaderOptions: {
        css: {
          url: true, // 允许 CSS 中的 URL 自动处理相对路径
        }
      }
    }
  };