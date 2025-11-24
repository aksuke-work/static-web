# 静的Webサイト制作テンプレートガイド

このドキュメントは、このプロジェクトで使用されている静的Webサイト制作のテンプレート構造とルールをまとめたものです。Cursorのエージェントが次回以降に静的HTMLファイルを作成する際の参考として使用してください。

## 目次

1. [プロジェクト構造](#プロジェクト構造)
2. [ビルドシステム](#ビルドシステム)
3. [CSS/SASS構造](#csssass構造)
4. [JavaScript構造](#javascript構造)
5. [BEM命名規則](#bem命名規則)
6. [EJSテンプレート](#ejsテンプレート)
7. [画像の扱い](#画像の扱い)

---

## プロジェクト構造

### ディレクトリ構成

```
nagaranew/
├── config/              # 設定ファイル（環境変数など）
│   ├── development.yaml
│   └── production.yaml
├── src/                 # ソースファイル
│   ├── images/          # 画像ファイル（圧縮処理される）
│   ├── pages/           # EJSテンプレート（HTMLに変換される）
│   │   ├── template/    # 共通テンプレート（header, footerなど）
│   │   └── *.ejs        # 各ページのテンプレート
│   ├── scripts/         # WebpackでビルドされるJSファイル
│   ├── components/      # 再利用可能なコンポーネント
│   ├── static/          # そのままコピーされるファイル
│   │   └── js/          # 静的JSファイル（そのまま使用）
│   └── styles/          # SASSファイル
│       ├── common/      # 共通コンポーネント（header, footerなど）
│       ├── components/  # 再利用可能なコンポーネント
│       └── pages/       # ページ固有のスタイル
├── public/              # ビルド後の出力先（Git管理対象外）
├── gulp/                # Gulpタスク（モジュール化）
│   ├── tasks/           # 各タスクファイル
│   ├── config.mjs       # 設定ファイル
│   └── utils.mjs        # ユーティリティ関数
├── gulpfile.mjs         # Gulpタスク定義（ESM形式）
├── webpack.config.js    # Webpack設定
└── package.json         # 依存関係とスクリプト
```

### 重要なルール

- **`src/pages/**/[^_]\*.ejs`\*\*: アンダースコアで始まるファイルは無視される
- **`src/scripts/**/[^_]\*.js`\*\*: アンダースコアで始まるファイルは無視される
- **`public/`**: ビルド後のファイルが出力される（手動で編集しない）

---

## ビルドシステム

### 使用技術

- **Gulp 4**: タスクランナー（ESM形式、`gulpfile.mjs`）
- **EJS**: HTMLテンプレートエンジン
- **SASS**: CSSプリプロセッサ
- **Webpack + Babel**: JavaScriptのバンドルとトランスパイル
- **BrowserSync**: 開発サーバーとホットリロード

### ビルドコマンド

```bash
# 開発環境でビルド + サーバー起動 + ファイル監視
npm run gulp

# ビルドのみ（開発環境）
npm run gulp build

# ビルドのみ（本番環境）
NODE_ENV=production npm run gulp build
```

### ビルドプロセス

1. **ページ生成**: `src/pages/**/[^_]*.ejs` → `public/**/*.html`（HTML整形付き）
2. **画像圧縮**: `src/images/**` → `public/images/**`（JPEG/PNG/GIF/SVG圧縮 + WebP変換）
3. **SASSコンパイル**: `src/styles/**/[^_]*.scss` → `public/css/*.css`
4. **JavaScriptバンドル**: `src/scripts/**/[^_]*.js` → `public/js/*.js`（Webpack + コードスプリッティング）
5. **静的ファイルコピー**: `src/static/**` → `public/**`

### 環境変数

- `NODE_ENV=development`（デフォルト）: ソースマップ生成、デバッグ情報出力、展開形式のCSS
- `NODE_ENV=production`: 圧縮・最適化された出力、圧縮形式のCSS

---

## CSS/SASS構造

### ファイル構造

```
src/styles/
├── style.scss          # メインスタイルファイル（全ページ用）
├── common.scss         # 共通スタイルファイル（特定ページ用）
├── _base.scss          # リセットCSSと基本スタイル
├── _animation.scss     # アニメーション定義
├── common/             # 共通コンポーネント
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _gnav.scss
│   └── ...
├── components/         # 再利用可能なコンポーネント
│   ├── _button.scss
│   ├── _ttl.scss
│   └── ...
└── pages/              # ページ固有のスタイル
    ├── _index.scss
    ├── _about.scss
    └── ...
```

### SASSのインポート

`style.scss`の例：

```scss
@charset 'utf-8';
@use 'sass:math';

// 変数・mixin定義
$responsive: (
    'sp': 'screen and (max-width: 768px)',
    'tab': 'screen and (max-width: 1160px)', // ...
);

@mixin media($breakpoint: sp) {
    @media #{map-get($responsive, $breakpoint)} {
        @content;
    }
}

// インポート
@import '~html5-reset';
@import '_base';
@import '_animation';
@import 'components/**/*.scss'; // ワイルドカードで一括インポート
@import 'common/**/*.scss';
@import 'pages/**/*.scss';
```

**注意**:

- `gulp-sass-glob`を使用してグロブパターンを展開します。`/**/*.scss`形式を明示的に指定することで、各ディレクトリ配下のすべてのSCSSファイルが自動的にインポートされます。
- `common.scss`は独立したエントリーファイルとして扱われます。グロブパターン`@import 'common/**';`を使用する場合は、`gulp-sass-glob`が正しく動作するように設定されています。`common.scss`内で`common/**`をインポートする場合は、個別のインポート文を使用してください。
- 新しいSCSSファイルを追加する際は、個別にインポート文を追加する必要はありません。ワイルドカードパターンが自動的に新しいファイルを検出します。

### レスポンシブブレークポイント

```scss
$responsive: (
    'se': 'screen and (max-width: 321px)',
    'spm': 'screen and (max-width: 480px)',
    'sp': 'screen and (max-width: 768px)',
    'ipad': 'screen and (max-width: 960px)',
    'tab': 'screen and (max-width: 1160px)',
    'pc': 'screen and (max-width: 1480px)', // ...
);

// 使用例
@include media(sp) {
    // SP用スタイル
}
```

### カスタム関数

```scss
// 行間計算
@function lh($font-size, $line) {
    @return math.div($line, $font-size);
}

// VW計算（PC基準）
@function vw($size, $width: 1460) {
    @return math.div($size, $width) * 100vw;
}

// VW計算（SP基準）
@function vwSp($size, $width: 750) {
    @return math.div($size, $width) * 100vw;
}
```

---

## JavaScript構造

### ファイル配置

- **`src/static/js/`**: 静的JSファイル（そのまま使用）
- **`src/scripts/`**: WebpackでビルドされるJSファイル（個別にバンドルされる）
- **`src/components/`**: 再利用可能なコンポーネント（`index.js`が`main.js`に統合される）

### 使用ライブラリ

- **jQuery 3.4.1**: DOM操作（主に使用）
- **Swiper**: スライダー
- **GSAP + ScrollTrigger**: アニメーション・スクロール連動

### JavaScriptの記述方針

このプロジェクトでは、**jQueryを主に使用してJavaScriptを記述**します。jQueryを使用することで、DOM操作、イベント処理、アニメーションなどの処理を簡潔に記述できます。

### JavaScriptのビルド

- Webpackを使用してバンドルとトランスパイル
- コードスプリッティング対応（共通チャンクと個別エントリーポイント）
- 動的エントリーポイント検出（`src/scripts/**/[^_]*.js`）
- `src/components/**/index.js`と`src/scripts/main.js`は`main.js`として統合される

### JSファイルの読み込み

EJSテンプレートで読み込む例：

```ejs
<%- include('./template/_footer', {
    scripts: ['./js/index.js']
}) %>
```

### 典型的な構造

```javascript
// jQueryの使用例
$(document).ready(function () {
    // DOM要素の取得と操作
    const $header = $('.header');
    const $nav = $('.gNav');

    // イベントハンドラ
    $('.js-toggle-menu').on('click', function () {
        $nav.toggleClass('isActive');
    });

    // スクロールイベント
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 100) {
            $header.addClass('isScrolled');
        } else {
            $header.removeClass('isScrolled');
        }
    });
});

// Swiperの初期化例
const topMv__list_type_01 = new Swiper('.topMv__list_type_01', {
    loop: true,
    slidesPerView: 1,
    effect: 'fade',
    speed: 1000,
    autoplay: { delay: 3000 },
    pagination: {
        el: '.topMv__pagination_type_02',
        clickable: true,
    },
});

// GSAP + ScrollTriggerの例
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({
    '(min-width: 961px)': function () {
        // PC用の処理
    },
    '(max-width: 768px)': function () {
        // SP用の処理
    },
});
```

---

## BEM命名規則

### 基本ルール

このプロジェクトでは、**BEMをベースにしながらキャメルケースを使用**し、モディファイアの命名規則が特殊です。

### ブロック（Block）

- キャメルケースで記述
- 例: `.topMv`, `.header`, `.roundBtn`

### エレメント（Element）

- ブロック名 + `__`（アンダースコア2つ）+ エレメント名（キャメルケース）
- 例: `.topMv__inner`, `.topMv__listItem`, `.header__logo`

### モディファイア（Modifier）

**特殊な形式**: `_キー名_値`（アンダースコア1つでキー名と値を区切る）

#### 形式

```
ブロック名_キー名_値
エレメント名_キー名_値
```

#### 例

```html
<!-- HTML -->
<div class="topMv">
    <div class="topMv__inner">
        <div class="topMv__list topMv__list_type_01">
            <div class="topMv__listItem topMv__listItem_type_02">
                <!-- ... -->
            </div>
        </div>
    </div>
</div>
```

```scss
// SASS
.topMv {
    &__inner {
        // スタイル
    }

    &__list {
        &_type_01 {
            // type_01用のスタイル
        }

        &_type_02 {
            // type_02用のスタイル
        }
    }

    &__listItem {
        &_type_01 {
            // type_01用のスタイル
        }

        &_type_02 {
            // type_02用のスタイル
        }
    }
}
```

### 命名規則の例

#### ブロックレベルのモディファイア

```scss
.header {
    &_type_top {
        // トップページ用のヘッダー
    }

    &_type_under {
        // 下層ページ用のヘッダー
    }

    &.isScrolled {
        // スクロール時の状態
    }
}
```

#### エレメントレベルのモディファイア

```scss
.topProducts {
    &__listItemImg {
        &_type_front {
            // 前面画像
        }

        &_type_back {
            // 背面画像
        }
    }

    &__listItemPicture {
        &_type_wellness {
            // wellness用のスタイル
        }
    }
}
```

### 状態クラス

- `.isActive`, `.isScrolled`, `.jsActive` など、JavaScriptで制御する状態クラスは通常の形式
- `js-` プレフィックスはJavaScript用のフックとして使用

### 重要ポイント

1. **モディファイアは `_キー名_値` 形式**
    - ❌ `.topMv__inner--active`（標準BEM）
    - ✅ `.topMv__inner_is_active` または `.topMv__inner_type_01`

2. **キャメルケースを使用**
    - ❌ `.top-mv`, `.top-mv__inner`
    - ✅ `.topMv`, `.topMv__inner`

3. **ネストの深さ**
    - モディファイアは要素の直下にネスト
    ```scss
    &__element {
        &_modifier {
            // スタイル
        }
    }
    ```

---

## EJSテンプレート

### テンプレートの構造

```
src/pages/
├── index.ejs              # トップページ
├── about/
│   └── index.ejs         # aboutページ
└── template/
    ├── _header.ejs       # 共通ヘッダー
    ├── _header_02_01.ejs # ヘッダーのバリエーション（必要に応じて）
    ├── _footer.ejs       # 共通フッター
    └── _footer_02_01.ejs # フッターのバリエーション（必要に応じて）
```

**注意**: テンプレートファイルは、ページの要件に応じて異なるバリエーション（例: `_header_02_01.ejs`）を使用できます。インクルードする際は、実際に存在するファイル名を指定してください。

### テンプレートのインクルード

```ejs
<%- include('./template/_header', {
    meta: {
        title: 'ページタイトル',
        description: 'ページの説明',
        'siteType': 'website',
        url: 'about/',
    }
}) %>

<!-- ページコンテンツ -->

<%- include('./template/_footer', {
    scripts: ['./js/index.js']
}) %>
```

**注意**:

- インクルードするファイル名は、実際に存在するファイルを指定してください。
- エラーが発生する場合は、ファイルパスとファイル名が正しいか確認してください。
- サブディレクトリからインクルードする場合は、相対パス（例: `../template/_header`）を正しく指定してください。

### 設定ファイルの使用

`config/development.yaml`の値はEJSテンプレートで使用可能：

```yaml
# config/development.yaml
siteName: ' | サイト名'
copyrightOwner: '© 2024 会社名'
```

```ejs
<title><%= meta.title %><%= siteName %></title>
```

### メタ情報の渡し方

```ejs
<%- include('./template/_header', {
    meta: {
        title: 'ページタイトル',
        description: 'ページの説明',
        'siteType': 'website',
        url: 'about/',
    }
}) %>
```

---

## 画像の扱い

### 画像の配置

- **配置場所**: `src/images/`
- **出力先**: `public/images/`（自動圧縮）

### 画像圧縮

Gulpで自動的に以下の処理が行われます：

- **JPEG**: mozjpeg（品質100）
- **PNG**: pngquant（品質1-1）
- **SVG**: SVGO
- **GIF**: gifsicle
- **WebP変換**: JPEG/PNG → WebP（品質80）

### 画像の削除

`src/images/`から画像を削除すると、対応する`public/images/`内のファイル（元画像とWebPファイル）も自動的に削除されます。

### 画像の参照

```html
<!-- EJSテンプレート内 -->
<img src="./images/img_01.jpg" alt="画像説明" />

<!-- レスポンシブ画像 -->
<picture>
    <source media="(max-width: 960px)" srcset="./images/img_03_sp.jpg" />
    <img src="./images/img_03.jpg" alt="画像説明" />
</picture>
```

---

## 開発時の注意点

### 1. ファイル命名規則

- **アンダースコアで始まるファイルは無視される**
    - `_example.scss` → ビルドされない
    - `example.scss` → ビルドされる

### 2. SASSのネスト

- ネストは3階層まで推奨
- BEMの構造に合わせてネストする

```scss
.block {
    &__element {
        &_modifier {
            // OK: 3階層
        }
    }
}
```

### 3. レスポンシブデザイン

- `@include media()` でモバイルファースト
- デフォルトはPC、`@include media(sp)` でSP用スタイル

### 4. JavaScriptの初期化

- SwiperやGSAPはDOMContentLoaded後に初期化
- リサイズイベントは適切にデバウンス

### 5. パフォーマンス

- 画像は適切なサイズ・形式を使用
- CSS/JSは本番環境で圧縮される
- 開発環境ではソースマップが生成される

### 6. SASSのワイルドカードインポート

- `gulp-sass-glob`を使用してワイルドカードパターンを展開します
- `/**/*.scss`形式を明示的に指定することで、各ディレクトリ配下のすべてのSCSSファイルが自動的にインポートされます
- 新しいSCSSファイルを追加する際は、個別にインポート文を追加する必要はありません
- ファイル名がアンダースコア（`_`）で始まるファイルはパーシャルとして扱われ、自動的にインポートされます

### 7. ビルドエラーの対処

ビルド時にエラーが発生した場合：

1. **EJSテンプレートのエラー**
    - インクルードするファイルが存在するか確認
    - ファイルパスが正しいか確認（相対パスの指定に注意）

2. **SASSのエラー**
    - インポートパスが正しいか確認
    - ファイルが存在するか確認
    - 構文エラーがないか確認

3. **JavaScriptのエラー**
    - エントリーファイルが正しく指定されているか確認
    - 依存関係が正しくインストールされているか確認

---

## まとめ

このテンプレートの特徴：

1. **BEM + キャメルケース**: `.topMv__inner_type_01`
2. **モディファイア**: `_キー名_値` 形式
3. **Gulpベースのビルドシステム**（ESM形式、モジュール化されたタスク）
4. **EJSテンプレート**によるHTML生成（HTML整形付き）
5. **SASSのモジュール構造**
6. **レスポンシブ対応**のメディアクエリ
7. **WebpackによるJavaScriptバンドル**（コードスプリッティング対応）
8. **WebP画像変換**による最適化
9. **Prettierによるコードフォーマット統一**
10. **自動ファイル削除**機能（ソースファイル削除時の対応）
