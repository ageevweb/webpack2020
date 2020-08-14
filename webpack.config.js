const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// очищает папку dist
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// перенос статики из src to dist
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const OptimazeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const optimizationFunct = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if(isProd) {
    config.minimizer = [
      new OptimazeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    'css-loader'
  ]

  if(extra) {
    loaders.push(extra)
  }

  return loaders
}

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
console.log('isDev = ', isDev)


const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if(preset){
    opts.presets.push(preset)
  }

  return opts
}

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }]

  if(isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  // entry: './src/index.js', // точка входа
  // или несколько точек входа
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts'
  },
  output: {
    filename: filename('js'), // имя файла результата
    path: path.resolve(__dirname, 'dist') // его путь
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimizationFunct(),
  devServer: {
    port: 4040,
    hot: isDev, // если true
  },
  devtool: isDev ? 'source-map' : '',
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'src/assets/img/favicon.ico'), 
          to: path.resolve(__dirname, 'dist')
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  // loaders - добавление к WP функционала, позв работать с другими типами файлов
  module: {
    // подключили css в index.js
    rules: [
      {
        // если попадаются файлы подходящие под данный паттерн, то использовать ЭТОТ лоадер
        test: /\.css$/,
        // важен порядок, справа-налево
        // style-loader - Добавляет стили описываемые в css в <head> в html 
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: jsLoaders()
      },
      { 
        test: /\.ts$/, 
        exclude: /node_modules/, 
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        } 
      },
      { 
        test: /\.jsx$/, 
        exclude: /node_modules/, 
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        } 
      }
    ]
  }
}