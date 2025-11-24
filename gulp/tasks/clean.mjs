import { deleteAsync } from 'del';
import path from 'path';
import gulpConfig from '../config.mjs';

/**
 * publicディレクトリ内の全ファイルを削除（.gitkeepは除外）
 */
const clearPublicDirectory = () => {
    return deleteAsync([`${gulpConfig.distBase}/**/*`, `!${gulpConfig.distBase}/.gitkeep`]);
};

/**
 * ファイル削除処理（共通の削除ロジック）
 * @param {string} filePath - 削除対象のファイルパス（src配下のパス）
 * @param {string} srcPath - ソースディレクトリのパス（例: 'src/images'）
 * @param {string} publicPath - 出力先ディレクトリのパス（例: 'public/images'）
 * @param {Object} extReplace - 拡張子の置き換えルール（例: { '.ejs': '.html' }）
 * @returns {Promise<void>} 削除処理のPromise
 */
const cleanFile = async (filePath, srcPath, publicPath, extReplace = {}) => {
    let deletedPath = filePath.replace(srcPath, publicPath);

    // 拡張子の置き換え処理
    Object.entries(extReplace).forEach(([fromExt, toExt]) => {
        deletedPath = deletedPath.replace(new RegExp(`${fromExt}$`), toExt);
    });

    await deleteAsync(deletedPath);
};

export default {
    clearPublicDirectory,
    cleanFile,
};
