const path = require('path');
require('dotenv').config();
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    target: 'web',

    context: __dirname,

    entry: {
        maplibre: 'maplibre-gl/dist/maplibre-gl.css',
        appStyle: './src/styles/main.scss',
        polyfill: './src/polyfill.ts',
        config: './src/config.js',
        app: './src/app.tsx'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: process.env.PUBLIC_PATH || '/',
        filename: (pathData) => {
            if (pathData.chunk.name === 'config') {
                return 'js/config.js';
            }
            return `js/${pathData.chunk.name}-${pathData.chunk.hash}.js`;
        },
        assetModuleFilename: 'files/[name]-[hash].[ext]',
        crossOriginLoading: 'anonymous'
    },

    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.(s[ac]ss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(geo)?json$/,
                type: 'asset/resource'
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/,
                type: 'asset'
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset/resource'
            }
        ]
    },

    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            '@app': path.resolve(__dirname, 'src/')
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new FaviconsWebpackPlugin({
            logo: './src/images/favicon.png',
            prefix: 'icons/',
            emitStats: false,
            inject: true,
            favicons: {
                icons: {
                    android: false,
                    appleIcon: false,
                    appleStartup: false,
                    coast: false,
                    favicons: true,
                    firefox: false,
                    windows: false,
                    yandex: false
                }
            }
        }),
        new MiniCssExtractPlugin({ filename: 'css/[name]-[fullhash].css' }),
        new ESLintPlugin({
            emitWarning: true,
            failOnError: false
        }),
        new CleanWebpackPlugin()
    ]
};
