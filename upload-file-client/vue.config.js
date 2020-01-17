const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.devServer
      .host('0.0.0.0')
      .proxy({
        '/api': {
          target: 'http://localhost:8089',
          pathRewrite: { '^/api': '' }
        }
      })
  }
}