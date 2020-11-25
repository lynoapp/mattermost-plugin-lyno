import { exec } from 'child_process';
import path from 'path';
import Dotenv from 'dotenv-webpack';
import increaseSpecificity from 'postcss-increase-specificity';

import { id as PLUGIN_ID } from '../plugin.json';

const NPM_TARGET = process.env.npm_lifecycle_event; // eslint-disable-line no-process-env
let mode = 'production';
let devtool = '';
if (NPM_TARGET === 'debug' || NPM_TARGET === 'debug:watch') {
  mode = 'development';
  devtool = 'source-map';
}

const plugins = [
  new Dotenv({
    systemvars: true,
  }),
];

if (NPM_TARGET === 'build:watch' || NPM_TARGET === 'debug:watch') {
  plugins.push({
    apply: (compiler) => {
      compiler.hooks.watchRun.tap('WatchStartPlugin', () => {
        // eslint-disable-next-line no-console
        console.log('Change detected. Rebuilding webapp.');
      });
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
        exec('cd .. && make deploy-from-watch', (err, stdout, stderr) => {
          if (stdout) {
            process.stdout.write(stdout);
          }
          if (stderr) {
            process.stderr.write(stderr);
          }
        });
      });
    },
  });
}

module.exports = {
  entry: [
    '@apollo/client',
    './src/index.tsx',
  ],
  resolve: {
    modules: [
      'src',
      'node_modules',
      path.resolve(__dirname),
    ],
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules\/(?!(@lyno)\/)/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  increaseSpecificity({ stackableRoot: '.lyno', repeat: 1 }),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules/compass-mixins/lib', 'sass'],
              },
            },
          },
        ],
      },
    ],
  },
  externals: {
    react: 'React',
    redux: 'Redux',
    'react-redux': 'ReactRedux',
    'prop-types': 'PropTypes',
    'react-bootstrap': 'ReactBootstrap',
    'react-router-dom': 'ReactRouterDom',
  },
  output: {
    devtoolNamespace: PLUGIN_ID,
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'main.js',
  },
  devtool,
  mode,
  plugins,
};
