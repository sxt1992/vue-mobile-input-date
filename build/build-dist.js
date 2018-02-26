const path = require('path');
const webpack = require('webpack');
const package = require('../package.json');

const genFile = cfg => webpack(cfg, function (err, stats) {
    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');

    console.log('  Build complete.\n');
});

const genCfg = (filename, plugins = []) => ({
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../lib'),
        publicPath: '/lib/',
        filename,
        library: 'MobileInputDate',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: 'vue-style-loader!css-loader',
                        less: 'vue-style-loader!css-loader!less-loader'
                    },
                    postLoaders: {
                        html: 'babel-loader'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader', exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'autoprefixer-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader?sourceMap'
                ]
            },
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=8192'},
            { test: /\.(html|tpl)$/, loader: 'html-loader' }
        ]
    },
    externals: {
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        }
    },
    plugins: [
        new webpack.BannerPlugin('MobileInputDate.js v' + package.version +
            '\n©2017-' + new Date().getFullYear() + ' Taoxj' +
            '\nReleased under the MIT License.'),
        new webpack.DefinePlugin({
            'process.env.VERSION': JSON.stringify(package.version)
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ].concat(plugins)
});

// 普通 js
genFile(genCfg('MobileInputDate.js'));

// 压缩 js
genFile(genCfg('MobileInputDate.min.js', [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
]));
