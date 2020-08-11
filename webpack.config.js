const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// очищает папку dist
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  // entry: './src/index.js', // точка входа
  // или несколько точек входа
  entry: {
    main: './index.js',
    analytics: './analytics.js'
  },
  output: {
    filename: '[name].[contenthash].js', // имя файла результата
    path: path.resolve(__dirname, 'dist') // его путь
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin()
  ],
  // loaders - добавление к WP функционала, позв работать с другими типами файлов
  module: {
    // подключили css в index.js
    rules: [
      {
        // если попадаются файлы подходящие под данный паттерн, то использовать ЭТОТ лоадер
        test: /\.css/,
        // важен порядок, справа-налево
        // style-loader - Добавляет стили описываемые в css в <head> в html 
        use: ['style-loader','css-loader']
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      }
    ]
  }
}