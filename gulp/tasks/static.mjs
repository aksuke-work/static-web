import gulp from 'gulp';
import gulpConfig from '../config.mjs';

/**
 * 静的ファイルをコピー
 */
export const staticfile = () => {
    return gulp.src('src/static/**', { dot: true }).pipe(gulp.dest(gulpConfig.distBase));
};

