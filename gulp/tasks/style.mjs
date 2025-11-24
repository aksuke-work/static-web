import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sassCompiler from 'sass';
import sassGlob from 'gulp-sass-glob';
import prefixer from 'gulp-autoprefixer';
import importer from 'node-sass-package-importer';
import sourcemaps from 'gulp-sourcemaps';
import noop from 'gulp-noop';
import merge from 'merge-stream';
import gulpConfig from '../config.mjs';

const sass = gulpSass(sassCompiler);

/**
 * Sassファイルのコンパイルとスタイルの生成
 */
export const style = () => {
    const srcBase = 'src/styles';
    const scss = gulp
        .src(srcBase + '/**/[^_]*.scss')
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(
            sass({
                includePaths: [srcBase],
                outputStyle: gulpConfig.dev ? 'expanded' : 'compressed',
                importer: importer({
                    extensions: ['.scss', '.css'],
                }),
            }).on('error', sass.logError)
        )
        .pipe(prefixer())
        .pipe(gulpConfig.dev ? sourcemaps.write() : noop())
        .pipe(gulp.dest(gulpConfig.distBase + '/css'));

    return merge(scss);
};
