const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Plugin untuk menyertakan file HTML lain ke dalam template HTML utama
 */
class HtmlIncludePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlIncludePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'HtmlIncludePlugin',
        (data, cb) => {
          // Cari semua tag yang memiliki atribut data-include
          const includeRegex = /<div\s+data-include="([^"]+)"[^>]*><\/div>/g;
          
          // Ganti dengan konten file yang disertakan
          data.html = data.html.replace(includeRegex, (match, includePath) => {
            try {
              // Path relatif terhadap template HTML
              const templateDir = path.dirname(data.plugin.options.template);
              const fullPath = path.resolve(templateDir, includePath);
              
              // Baca file yang disertakan
              if (fs.existsSync(fullPath)) {
                return fs.readFileSync(fullPath, 'utf8');
              }
              
              console.warn(`File tidak ditemukan: ${fullPath}`);
              return '';
            } catch (error) {
              console.error(`Error saat menyertakan file HTML: ${error.message}`);
              return '';
            }
          });
          
          cb(null, data);
        }
      );
    });
  }
}

module.exports = HtmlIncludePlugin;