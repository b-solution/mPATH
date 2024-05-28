// // https://webpack.js.org/guides/development/
// //https://dev.to/lavikara/setup-vue-webpack-and-babel-boo
// // https://github.com/lavikara/basic-vue-boilerplate/blob/master/webpack.config.js
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/dashboard.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public')
    },
    client: {
      overlay: false
    },
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // ...existing loaders...
            // Add an additional loader to handle the result of these loaders
            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
          }
        }
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: { implementation: require('node-sass') }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      favicon: './public/favicon.ico'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    })
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.ts', '.tsx', '.vue', '.css', '.scss'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': `${path.resolve(__dirname, 'src')}`
    }
  }
}

// const { VueLoaderPlugin } = require("vue-loader");
// const htmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const autoprefixer = require("autoprefixer");
// const path = require("path");

// module.exports = {
//   mode: 'development',
//   entry: {
//     index: './src/dashboard.js'
//   },
//   output: {
//     filename: "[name].[contenthash:8].js",
//     path: path.resolve(__dirname, "dist"),
//     chunkFilename: "[name].[contenthash:8].js",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },
//       {
//         test: /\.vue$/,
//         loader: "vue-loader",
//       },
//       {
//         test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
//         loader: "file-loader",
//         options: {
//           name: "[name][contenthash:8].[ext]",
//         },
//       },
//       {
//         test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
//         loader: "file-loader",
//         options: {
//           name: "[name][contenthash:8].[ext]",
//           outputPath: "assets/img",
//           esModule: false,
//         },
//       },
//       {
//         test: /\.s?css$/,
//         use: [
//           "style-loader",
//           MiniCssExtractPlugin.loader,
//           "css-loader", "postcss-loader","sass-loader",
//         ],
//       },
//     ],
//   },
//   plugins: [
//     new VueLoaderPlugin(),
//     new CleanWebpackPlugin(),
//     new MiniCssExtractPlugin({
//       filename: "[name].[contenthash:8].css",
//       chunkFilename: "[name].[contenthash:8].css",
//     }),
//     new htmlWebpackPlugin({
//       template: path.resolve(__dirname, "public", "index.html"),
//       favicon: "./public/favicon.ico",
//     }),
//   ],
//   resolve: {
//     modules: ['node_modules'],
//     alias: {
//       vue$: "vue/dist/vue.runtime.esm.js",
//       "@": `${path.resolve(__dirname, "src")}`,
//     },
//     extensions: ["*", ".js", ".vue", ".json", ".css"],
//   },
//   optimization: {
//     moduleIds: "deterministic",
//     runtimeChunk: "single",
//     splitChunks: {
//       cacheGroups: {
//         vendor: {
//           test: /[\\/]node_modules[\\/]/,
//           name: "vendors",
//           priority: -10,
//           chunks: "all",
//         },
//       },
//     },
//   },
//   devServer: {
//     historyApiFallback: true,
//     static: {
//       directory: path.join(__dirname, 'public'),
//     },
//     compress: true,
//     port: 9000,
//   },

// };
