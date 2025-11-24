import gulp from 'gulp';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import htmlbeautify from 'gulp-html-beautify';
import { createRequire } from 'module';
import gulpConfig from '../config.mjs';

const require = createRequire(import.meta.url);
const config = require('config');

/**
 * EJSファイルをHTMLにコンパイルし、整形して出力するタスク
 */
export const page = () =>
    gulp
        .src('src/pages/**/[^_]*.ejs')
        .pipe(
            ejs({
                config,
                siteName: config.siteName,
                copyrightOwner: config.copyrightOwner,
                hasBundle: gulpConfig.prevHasBundle,
                hasMain: gulpConfig.prevHasMain,
                outputScriptName: gulpConfig.outputFilename,
            })
        )
        .pipe(rename({ extname: '.html' }))
        .pipe(
            htmlbeautify({
                indent_size: 4,
                indent_char: ' ',
                max_preserve_newlines: 0,
                preserve_newlines: false,
                extra_liners: [],
            })
        )
        .pipe(gulp.dest(gulpConfig.distBase));
