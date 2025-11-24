import gulp from 'gulp';
import clean from './gulp/tasks/clean.mjs';
import { script } from './gulp/tasks/script.mjs';
import { page } from './gulp/tasks/page.mjs';
import { image } from './gulp/tasks/image.mjs';
import { style } from './gulp/tasks/style.mjs';
import { staticfile } from './gulp/tasks/static.mjs';
import { server } from './gulp/tasks/server.mjs';
import { watch } from './gulp/tasks/watch.mjs';

const { series, parallel } = gulp;
const { clearPublicDirectory } = clean;

export const build = series(
    clearPublicDirectory,
    parallel(script, page, image, style, staticfile)
);
export default series(
    parallel(script, page, image, style, staticfile),
    server,
    watch
);

