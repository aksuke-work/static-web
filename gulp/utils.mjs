import gulp from 'gulp';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import webp from 'gulp-webp';
import path from 'path';
import { deleteAsync } from 'del';

/**
 * JPEG/PNG形式の圧縮処理
 * @param {string} from 処理前画像ファイルの配置パス（末尾に / をつけない）
 * @param {string} to 処理後画像ファイルの配置パス（末尾に / をつけない）
 */
export const imageminJpegPng = (from, to) =>
    gulp
        .src(`${from}/**/*.{jpg,jpeg,png}`)
        .pipe(changed(to))
        .pipe(
            imagemin([
                pngquant({ quality: [1, 1], speed: 1 }),
                mozjpeg({ quality: 100 }),
            ])
        )
        .pipe(gulp.dest(to));

/**
 * GIF/SVG形式の圧縮処理
 * @param {string} from 処理前画像ファイルの配置パス（末尾に / をつけない）
 * @param {string} to 処理後画像ファイルの配置パス（末尾に / をつけない）
 */
export const imageminGifSvg = (from, to) =>
    gulp
        .src(`${from}/**/*.{gif,svg}`)
        .pipe(changed(to))
        .pipe(imagemin([imagemin.svgo(), imagemin.gifsicle()]))
        .pipe(gulp.dest(to));

/**
 * JPEG/PNG形式 → WebP形式への変換
 * @param {string} from 処理前画像ファイルの配置パス（末尾に / をつけない）
 * @param {string} to 処理後画像ファイルの配置パス（末尾に / をつけない）
 * @param {Object} options WebP変換のオプション
 */
export const imageWebp = (from, to, options = { quality: 80 }) =>
    gulp
        .src(`${from}/**/*.{jpg,jpeg,png}`)
        .pipe(changed(to))
        .pipe(webp(options))
        .pipe(gulp.dest(to));

/**
 * すべての画像形式の圧縮処理（後方互換性のため）
 * @param {string} from 処理前画像ファイルの配置パス（末尾に / をつけない）
 * @param {string} to 処理後画像ファイルの配置パス（末尾に / をつけない）
 */
export const imageminTask = (from, to) =>
    gulp
        .src(`${from}/**/*.{jpg,jpeg,png,gif,svg}`)
        .pipe(changed(to))
        .pipe(
            imagemin([
                pngquant({ quality: [1, 1], speed: 1 }),
                mozjpeg({ quality: 100 }),
                imagemin.svgo(),
                imagemin.gifsicle(),
            ])
        )
        .pipe(gulp.dest(to));

/**
 * 削除された画像ファイルに対応するpublic/images配下のファイルを削除する
 * （元画像とWebPファイルの両方を削除）
 * @param {string} deletedPath 削除されたファイルのパス（絶対パスまたは相対パス）
 * @returns {Promise<void>} 削除処理のPromise
 */
export const deleteImage = async (deletedPath) => {
    const projectRoot = process.cwd();
    const relativePath = path.relative(
        path.join(projectRoot, 'src/images'),
        deletedPath
    );
    const publicPath = path.join(projectRoot, 'public/images', relativePath);
    
    // 元画像とWebPファイルの両方を削除
    const filesToDelete = [publicPath];
    
    // JPEG/PNGファイルが削除された場合、対応するWebPファイルも削除
    const webpPath = publicPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    if (webpPath !== publicPath) {
        filesToDelete.push(webpPath);
    }
    
    await deleteAsync(filesToDelete);
};
