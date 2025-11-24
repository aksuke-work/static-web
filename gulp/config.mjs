const gulpConfig = {
    dev: (process.env['NODE_ENV'] || 'production').toLowerCase() === 'development', // この値が true のときのみ、デバッグ情報出力やソースマップ生成を行う。
    distBase: 'public', // 出力先ディレクトリ
    prevHasBundle: null,
    prevHasMain: null,
    chunkName: 'common',
    outputFilename: 'common.bundle.js',
};

export default gulpConfig;
