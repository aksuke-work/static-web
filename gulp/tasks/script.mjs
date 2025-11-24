import gulp from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { page } from './page.mjs';
import gulpConfig from '../config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const webpackConfig = require('../../webpack.config.js');

/**
 * Webpackのエントリーファイルを動的に取得
 */
const getEntryFiles = () => {
    const entryFiles = [...glob.sync('./src/scripts/**/[^_]*.js')].reduce((entries, file) => {
        const name = path.relative('./src/scripts', file).replace(/\.js$/, '');
        entries[name] = file;
        return entries;
    }, {});

    const mainFiles = ['./src/components/**/index.js', './src/scripts/main.js'].flatMap(pattern => glob.sync(pattern));

    if (mainFiles.length > 0) {
        entryFiles['main'] = mainFiles;
    }

    return entryFiles;
};

/**
 * JavaScriptのWebpackビルド処理
 */
export const script = () => {
    const customWebpackConfig = {
        ...webpackConfig,
        entry: getEntryFiles(),
        mode: gulpConfig.dev ? 'development' : 'production', // dev の値に応じて mode を設定
        optimization: {
            splitChunks: {
                chunks: 'all',
                filename: gulpConfig.outputFilename,
                name: gulpConfig.chunkName,
            },
        },
    };

    return webpackStream(customWebpackConfig, webpack)
        .pipe(gulp.dest(`./${gulpConfig.distBase}/js`))
        .on('end', () => {
            // ファイルが存在するかチェック
            const hasBundle = fs.existsSync(`${gulpConfig.distBase}/js/` + gulpConfig.outputFilename);
            const hasMain = fs.existsSync(`${gulpConfig.distBase}/js/main.js`);

            // 状態が変化した場合のみ page タスクを実行
            if (gulpConfig.prevHasBundle !== hasBundle || gulpConfig.prevHasMain !== hasMain) {
                gulpConfig.prevHasBundle = hasBundle;
                gulpConfig.prevHasMain = hasMain;
                page();
            }
        });
};
