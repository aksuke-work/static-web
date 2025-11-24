import gulp from 'gulp';
import { page } from './page.mjs';
import { image } from './image.mjs';
import { style } from './style.mjs';
import { script } from './script.mjs';
import { staticfile } from './static.mjs';
import clean from './clean.mjs';
import browserSync from 'browser-sync';

const { series } = gulp;
const { cleanFile } = clean;

/**
 * ファイル監視タスク（変更、削除の監視）
 */
export const watch = () => {
    const reload = done => {
        browserSync.reload(); // 変更後にブラウザをリロード
        done();
    };

    // 各種ファイルの監視とタスクの実行
    gulp.watch('src/pages/**', { events: ['add', 'change'] }, series(page, reload));
    gulp.watch('src/images/**', { events: ['add', 'change'] }, series(image, reload));
    gulp.watch('src/styles/**', { events: ['add', 'change'] }, series(style, reload));
    gulp.watch('src/static/**', { events: ['add', 'change'] }, series(staticfile, reload));
    gulp.watch('src/scripts/**', series(script, reload));
    gulp.watch('src/components/**/*.js', series(script, reload));
    gulp.watch('src/components/**/*.scss', series(style, reload));
    gulp.watch('src/components/**/*.ejs', series(page, reload));

    // ファイル削除時の処理
    gulp.watch('src/pages/**').on('unlink', async filePath => {
        await cleanFile(filePath, 'src/pages', 'public', { '.ejs': '.html' });
        browserSync.reload();
    });
    gulp.watch('src/images/**').on('unlink', async filePath => {
        await cleanFile(filePath, 'src/images', 'public/images', {
            '.jpg': '.webp',
            '.jpeg': '.webp',
            '.png': '.webp',
        });
        browserSync.reload();
    });
    gulp.watch('src/styles/**').on('unlink', async filePath => {
        await cleanFile(filePath, 'src/styles', 'public/css', { '.scss': '.css' });
        browserSync.reload();
    });
    gulp.watch('src/static/**').on('unlink', async filePath => {
        await cleanFile(filePath, 'src/static', 'public');
        browserSync.reload();
    });

    // ディレクトリ削除時の処理
    gulp.watch('src/pages/**').on('unlinkDir', async filePath => {
        await cleanFile(filePath, 'src/pages', 'public');
        browserSync.reload();
    });
    gulp.watch('src/images/**').on('unlinkDir', async filePath => {
        await cleanFile(filePath, 'src/images', 'public/images');
        browserSync.reload();
    });
    gulp.watch('src/styles/**').on('unlinkDir', async filePath => {
        await cleanFile(filePath, 'src/styles', 'public/css');
        browserSync.reload();
    });
    gulp.watch('src/static/**').on('unlinkDir', async filePath => {
        await cleanFile(filePath, 'src/static', 'public');
        browserSync.reload();
    });
    gulp.watch('src/scripts/**').on('unlinkDir', async filePath => {
        await cleanFile(filePath, 'src/scripts', 'public/js');
        browserSync.reload();
    });
};
