import connect from 'gulp-connect-php';
import browserSync from 'browser-sync';
import gulpConfig from '../config.mjs';

/**
 * ローカルサーバーの起動（PHP対応）
 */
export const server = done => {
    connect.server(
        {
            // port: 8281,
            // base: './public/'
        },
        () => {
            browserSync.init({ server: gulpConfig.distBase });
            done();
        }
    );
};
