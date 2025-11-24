import gulp from 'gulp';
import { imageminJpegPng, imageminGifSvg, imageWebp } from '../utils.mjs';

const { parallel } = gulp;

/**
 * JPEG/PNG形式の圧縮
 */
const compressJpegPng = () => imageminJpegPng('src/images', 'public/images');

/**
 * GIF/SVG形式の圧縮
 */
const compressGifSvg = () => imageminGifSvg('src/images', 'public/images');

/**
 * JPEG/PNG形式 → WebP形式への変換
 */
const convertWebp = () => imageWebp('src/images', 'public/images');

/**
 * 画像の最適化（圧縮とWebP変換を並列実行）
 */
export const image = parallel(compressJpegPng, compressGifSvg, convertWebp);
