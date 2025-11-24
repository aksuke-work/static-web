# 静的Webサイトボイラープレート
HTML/CSS/JavaScriptから成るシンプルな静的Webサイト制作で用いることを想定したボイラープレートです。

フレームワークなどを利用しないシンプルなPHPプログラムを追加することもできます。Composerはテンプレートに含めていませんが、`/vendor/`ディレクトリは`.gitignore`に含めていますので、利用するときはボイラープレートのトップディレクトリで実行してください。PHPプログラムは`static`ディレクトリ内に自由に配置するとよいですが、Composer利用時の注意点として、`static`ディレクトリから`vendor`ディレクトリを参照するパスと、それがコピーされたあと`public`ディレクトリから参照するときのパスが異なります（`static`のほうが一階層深い）。


## 導入
たとえば、マイプロジェクト（英語名: my-project）という新規案件にボイラープレートを利用するときは次のような手順で進めてください。

```
# ボイラープレートの取得
$ git clone moremostjp@moremostjp.git.backlog.com:/LIB/boilerplate-static-web.git
$ mv boilerplate-static-web my-project
$ cd my-project
$ git checkout v0.9.0
$ rm -rf .git

# 動作確認
$ npm install
$ npm run gulp

# 案件ごとのGitリポジトリへの保存
$ git init
$ git add .
$ git commit -m "initial commit"
$ git remote add origin <repository url for my-project>
$ git push -u origin master
```

## ビルド
サーバ上などでビルドのみを行いたい（browserSyncでWebサーバを立ち上げない）場合、次のコマンドを実行します。

```
$ npm install

# 開発環境用ビルド
$ npm run gulp build

# 本番環境用ビルド
$ NODE_ENV=production npm run gulp build
```

## ディレクトリ構成
| ディレクトリ | 説明 |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config` | 設定ファイルを配置する。node-configで読み込むので、基本的な使い方はnode-configに基づく。 ドメイン名など環境ごとに異なる値を用いたいときや、複数箇所で使われる変数を導入したいときに利用する。 設定ファイルで定義した値はEJSテンプレートの処理時にも変数として用いることができる |
| `public` | Webサーバによって公開されるディレクトリ。Git管理対象外とし、ここには手動でファイルを置いてはならない |
| `src/pages` | このディレクトリに配置した`**/*.ejs`ファイルはテンプレート処理され、 ファイルごとに対応するhtmlファイルとして`public`下に出力される。 ただし、アンダースコアで始まるファイルは無視される |
| `src/images` | このディレクトリに配置した画像ファイルは圧縮処理され`public/images`下に出力される|
| `src/scripts` | このディレクトリに配置した`**/*.js`ファイルは、個々に、必要なnodeモジュールと結合した上でBabelによってES5のコードにトランスパイルされ、`public/js`下に出力される。 ただし、アンダースコアで始まる名前のファイルは単体では出力されない |
| `src/styles` | このディレクトリに配置した`**/*.scss`ファイルは、個々に、importされているファイルと結合した上でトランスパイルされ、 `public/css`下に出力される。また、合わせて、画像ファイルは個々に圧縮処理され`public/css`下に出力される |
| `src/static` | このディレクトリに配置したファイルはそのまま`public`ディレクトリにコピーされる |

## 組み込みライブラリ
初期状態でjQueryのみ依存関係をもちます。不要な場合は削除してください。

```
$ npm uninstall jquery
```

## Composerモジュールの使用
PHPでComposerを使用したいときの手順例です。

### Composerの入手
自分がプロジェクトのトップディレクトリにいることを確認し、[Composerのダウンロードページ](https://getcomposer.org/download/)にある手順で、カレントディレクトリへComposerをダウンロードします。

```
$ php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
$ php -r "if (hash_file('sha384', 'composer-setup.php') === 'e0012edf3e80b6978849f5eff0d4b4e4c79ff1609dd1e613307e16318854d24ae64f26d17af3ef0bf7cfb710ca74755a') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
$ php composer-setup.php
$ php -r "unlink('composer-setup.php');"
```

カレントディレクトリには`composer.phar`ファイルだけが新たに追加された状態となります。なお、このファイルはGit管理対象外として`.gitignore`に記載してあります。Composerを使う人は、各自がそれぞれダウンロードを行ってください。

### 依存ライブラリのインストール
すでに誰かが用意した`composer.json`がプロジェクトに存在している場合で、そこに記載されているライブラリをインストールしたいだけの場合は、次のコマンドを実行するだけでOKです。

```
$ ./composer.phar install
```

### 【PHPライブラリを新規導入する人向け】 `composer.json`の作成
プロジェクトに`composer.json`が存在しない状態でComposerを使ってPHPライブラリをインストールしたい場合は、まず下記コマンドを実行して`composer.json`を作成します。ウィザード形式で設定が進みますが、一番最後の Do you confirm generation [yes]? まではすべてエンターキーでスキップしてOKです。最後だけyesと答えてください。

```
$ ./composer.phar init
```

### 【PHPライブラリを新規導入する人向け】依存ライブラリのインストール
プロジェクトに`composer.json`が存在している状態でComposerを使ってPHPライブラリをインストールしたい場合は、下記のようにします。ここでは仮にguzzleというHTTPクライアントライブラリをインストールしています。

```
$ ./composer.phar require guzzlehttp/guzzle
```

### PHPコードを書く
たとえば下記は、`src/static/api/ip.php`としてPHPファイルを作成したときの例です。require文に記載したコメントに注意してください。

```
<?php

// public/api/ip.phpとして配置された想定で、そこから見たautoload.phpの場所を参照する。
// これがIDEのコード補完などに影響するようなら、ボイラープレートの改善を検討する。
require '../../vendor/autoload.php';

$client = new GuzzleHttp\Client();
$res = $client->get('http://httpbin.org/ip');

header('Content-Type: application/json');
echo $res->getBody();
```
