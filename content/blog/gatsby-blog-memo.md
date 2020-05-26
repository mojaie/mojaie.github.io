---
title: Gatsbyでブログを構築した際の備忘録
dateCreated: 2020-04-27
dateModified: 2020-04-30
tags:
  - JavaScript
  - Node.js
  - Gatsby
  - React
  - GraphQL
  - static site generator
---

Gatsbyでこのサイト(mojaie.github.io)を構築した際の備忘録です。

Gatsby  
http://gatsbyjs.org/


### 導入経緯

ブログ用の静的サイトジェネレータとしてJekyllを以前使用していましたが、機能拡張のために新しくRubyを習得するのが面倒で、最近は他にもっとビルドが速いジェネレータがあるらしいということで乗り換えを検討することにしました。

HUGO、MetalSmith、Gatsbyを試してみましたが、GatsbyはReactとGraphQLベースで内部の仕組みが直感的に理解しやすく、ドキュメントもかなり充実しているので、当面Gatsbyで進めていきたいと思います。


### 前提

- Node.js

  GatsbyのプロジェクトはNode.jsのパッケージとして作成します。Node.jsがない場合はHomeBrewあるいはAnaconda等でインストールしておきます。


### 導入の流れ

1. **Node.js, gatsby-cliをインストールする**

   gatsbyコマンドをコマンドラインから使用するために、npmもしくはyarnでNode.jsのグローバルにgatsby-cliをインストールします。

   ```
   yarn install -g gatsby-cli
   ```

   主要なgatsbyのコマンド(developやserveなど)は後述のスターターから作成したプロジェクトのpackage.jsonのscriptに記載されていて、ローカルでは`npm run`や`yarn`で呼び出すことができます。実質、グローバルからgatsbyコマンドを実行するのは、newコマンドでプロジェクトを作成する時のみです。

1. **好きなスターター(starter)を選ぶ**

   スターター(starter)と呼ばれるGatsbyプロジェクトのテンプレートがGitリポジトリとして公開されているので、`gatsby new`でcloneしてプロジェクトを作成します。当サイトはgatsby-starter-blogというスターターを元に作成しています。

   ```
   gatsby new gatsby-starter-blog https://github.com/gatsbyjs/gatsby-starter-blog
   ```

   他のサイトジェネレータのようにテーマを選んで着せ替えるというよりは、最初にcloneした叩き台を元に自分で必要な機能を肉付けしていくというイメージです。gatsby本体やデフォルトのプラグインはnewコマンドでプロジェクトを作成した際に依存パッケージとしてインストールされます。

1. **機能追加、カスタマイズ**

   srcフォルダのスクリプトやスタイルシートを編集してデザインの変更や機能追加を行います。タグやカテゴリのような機能はプラグインとして公開されているものもありますが、公式ドキュメントのチュートリアルにしたがって簡単に実装可能です。

1. **記事を書く**

   Markdownで記事を書きます。frontmatterが利用可能で、フォーマットはJekyllやHugoなどと同様です。gatsby-starter-blogの場合、package.jsonに記載されたプラグインgatsby-transformer-remarkにより、remark.jsというパッケージを使用してMarkdownをパースします。他のプラグインを導入することでMarkdown以外のファイル形式も取り扱うことができます。

1. **デプロイ(GitHub Pages)**

   公式チュートリアルにはNetlifyやGitHub Pages等へのデプロイの例が記載されています。当サイトはGitHub Pagesでホスティングしています。GitHub Pageへのデプロイにはgh-pagesパッケージを使用します。

   ```
   yarn install gh-pages
   ```

   デプロイするリポジトリのmasterブランチを作成し、package.jsonのscriptに`"deploy": "gatsby build && gh-pages -d public -b master"`を記載しておきます。これで、`yarn deploy`によりプロジェクトのビルドとmasterへのpushが実行されます。


### スターター、プラグイン、テーマ

- スターター(starter)はプロジェクトの骨子となるgitリポジトリ。ブログ、技術文書、物販サイトなどのテンプレートから用途に一番近いものを選んで`gatsby new`する。
- プラグイン(plugin)は拡張機能で、npmのモジュールとして提供される。Markdownパーサ、画像最適化、ルーティング、SEO、各種ブログパーツなど。
- テーマ(theme)はプラグインの一種。srcフォルダに複数のテーマを設置して使い分けることで用途別に複数のサイトを運用可能。


### Gatsbyプロジェクトの構造

- **プロジェクトのルートディレクトリにあるもの**
  - **gatsby-config.js:** サイトのメタデータ、各種プラグイン設定など。
  - **gatsby-browser.js:** グローバルCSSやフォントの呼び出し、ルーティングの設定など。
  - **gatsby-node.js:** contentフォルダのファイルをパースしてページを生成しサイトを構築するスクリプト。
- **contentフォルダ:** Markdownファイルや画像など、サイトのコンテンツを格納
- **srcフォルダ:** Reactコンポーネントや各ページのCSSを格納
- **staticフォルダ:** サイトの自動生成に関与しないファイル。favicon.icoやrobot.txtなど生成したサイトでそのまま使うファイル。
- **node_modules:** Gatsbyのプラグインなど、Node.jsのモジュールが格納されている。
- **public:** Gatsbyで自動生成したサイト。


### ビルドプロセスの中身

`gatsby build`した際の挙動。

Gatsby Lifecycle APIs  
https://www.gatsbyjs.org/docs/gatsby-lifecycle-apis/


### 主なgatsbyコマンド

- `gatsby build`: ビルドのみ実施。publicフォルダにファイルが生成される。
- `gatsby clean`: ビルドしたデータを削除する。
- `gatsby develop`: 開発用サーバを起動する(process.env.NODE_ENV = development)。ビルドはしない。稼働中はファイルを変更するたびにホットリロードされてサイトに変更が即時反映される。
- `gatsby serve`: ビルドしたサイトのサーバを起動する(process.env.NODE_ENV = production)。デプロイ前の確認用。
