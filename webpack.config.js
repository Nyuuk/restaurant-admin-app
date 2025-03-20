const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const HtmlIncludePlugin = require('./html-include-plugin');

// Mendapatkan semua file HTML dari folder templates
const templateFiles = fs.readdirSync(path.resolve(__dirname, 'src/templates'))
  .filter(file => file.endsWith('.html'))
  .map(file => file);

// Konfigurasi multiple HTML files
const multipleHtmlPlugins = templateFiles.map(filename => {
  const name = filename.replace('.html', '');
  return new HtmlWebpackPlugin({
    template: `./src/templates/${filename}`,
    filename: filename,
    chunks: [name], // Hanya menyertakan entry point yang sesuai
    inject: 'body'
  });
});

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // Membuat entry points dinamis berdasarkan file HTML
  const entries = {};
  templateFiles.forEach(file => {
    const name = file.replace('.html', '');
    entries[name] = `./src/js/pages/${name}.js`;
  });
  
  // Tambahkan common entry point
  entries.common = './src/js/pages/common.js';
  
  return {
    entry: entries,
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'js/[name].[contenthash].js',
      clean: true,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash][ext]'
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            sources: true, // Untuk memproses atribut src, srcset, dll
            minimize: false
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css'
      }),
      ...multipleHtmlPlugins,
      new HtmlIncludePlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        // Create a separate chunk for vendor code
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      },
    },
  };
};