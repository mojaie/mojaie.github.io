---
title: Gatsbyでブログを構築した際の備忘録
date: 2020-04-27
published: true
tags:
  - Gatsby
  - React
  - GraphQL
  - Static site generator
---


### 導入経緯

ブログ用の静的サイトジェネレータとしてJekyllを以前使用していましたが、機能拡張のために新しくRubyを習得するのが面倒で、最近は他にもっとビルドが速いジェネレータがあるらしいということで乗り換えを検討することにしました。

HUGO、MetalSmith、Gatsbyを試してみましたが、GatsbyはReactとGraphQLベースで内部の仕組みが直感的に理解しやすく、ドキュメントもかなり充実しているので、当面Gatsbyで進めていきたいと思います。


### 導入の流れ

1. **Node.js, Gatsbyをインストールする**

   Node.jsはHomeBrewあるいはAnaconda等でインストールします。Gatsbyはnpmからインストールします。グローバルでもローカルでも構いません。package.jsonを生成してコマンドを書く、あるいはパスを通すなど何らかの方法でgatsbyコマンドを使えるようにしておく必要があります。
   ```
   npm install gatsby-cli
   ```

1. **好きなスターター(starter)を選ぶ**

   スターターというテンプレートがGitリポジトリとして公開されているので、cloneして使います。他のサイトジェネレータのようにテーマを選んで着せ替えるというよりは、最初にcloneした叩き台を元に自分で肉付けしていくというイメージです。
   ```
   gatsby new gatsby-starter-blog https://github.com/gatsbyjs/gatsby-starter-blog
   ```

1. **機能追加、カスタマイズ**

   srcフォルダのスクリプトやスタイルシートを編集してデザインの変更や機能追加を行います。タグやカテゴリのような機能はプラグインとして公開されているものもありますが、公式ドキュメントのチュートリアルにしたがって簡単に実装可能です。

1. **記事を書く**

   Markdownで記事を書きます。frontmatterが利用可能で、フォーマットはJekyllやHugoなどとほぼ同様です。gatsby-starter-blogにはプラグインgatsby-transformer-remarkがインストール済みで、remark.jsでMarkdownをパースします。他のプラグインを導入することでMarkdown以外のファイル形式も取り扱うことができます。

1. **デプロイ(GitHub Pages)**

   npmのgh-pagesモジュールをインストールすることで、GitHub Pagesにコマンド１つでデプロイできます。package.jsonでdeployコマンドを作成しておくと便利です。


### スターター、プラグイン、テーマ

- スターター(starter)はプロジェクトの骨子となるgitリポジトリ。ブログ、技術文書、物販サイトなどのテンプレートから用途に一番近いものを選んでcloneする。
- プラグイン(plugin)は拡張機能で、npmのモジュールとして提供される。
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

`gatsby build`した際の挙動。ホットリロードも同様のプロセスが走っているのだろうか。

Gatsby Lifecycle APIs  
https://www.gatsbyjs.org/docs/gatsby-lifecycle-apis/


### 主なgatsbyコマンド

- `gatsby build`: ビルドのみ実施。publicフォルダにファイルが生成される。
- `gatsby clean`: ビルドしたデータを削除する。
- `gatsby develop`: 開発用サーバを起動する(process.env.NODE_ENV = development)。ビルドはしない。稼働中はファイルを変更するたびにホットリロードされてサイトに変更が即時反映される。
- `gatsby serve`: ビルドしたサイトのサーバを起動する(process.env.NODE_ENV = production)。デプロイ前の確認用。
