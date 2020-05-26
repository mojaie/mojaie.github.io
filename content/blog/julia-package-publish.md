---
title: Juliaでパッケージを作成して公開する
dateCreated: 2020-02-24
dateModified: 2020-04-29
tags:
  - Julia
  - package manager
  - package development
---

Juliaでパッケージを作成する方法です。

(Juliaのパッケージシステムはまだ開発途上なので、頻繁に変更があります。)

### プロジェクトの作成



### メタファイルの作成

最低限必要と思われるメタファイルは以下です。

- Project.toml

  プロジェクトの設定が書かれたファイルです。

- Manifest.toml

  REPLでプロジェクトにパッケージをインストールすると自動的に生成されます。

- .travis.yml

  パッケージ登録、バージョンアップの際にTravisCIがPassしていることが自動マージの条件の一つになっています。CIのチェックが通らない場合、毎回レジストリ管理者のレビューが必要になります。


### JuliaRegistratorのインストール

JuliaRegistratorはGitHub appsで、下記ページからインストールできます。パッケージの更新(新規作成またはバージョンアップ)をレジストリに知らせるツールです。


### TagBotのインストール

以前はTagBotもGitHub appsでしたが、2020年2月頃からはGitHub Actionになっています。
.github/workflows以下に設定ファイルを置くことで、定期的にレジストリの更新をチェックし、


### 新規パッケージの登録

コミットのコメント蘭、もしくはissueに`@JuliaRegistrator register`と入力して投稿すると、自動的にレジストリにPull requestが送信されます。新しいパッケージを登録するリクエストを送ると、一定期間は登録が保留され、レジストリ管理者らによるレビューが行われます。

- 類似したパッケージが既にレジストリに登録されていないか
- 命名規則
    - パッケージ名は原則キャメルケース
    - 名前が長すぎないか
    - パッケージの内容が端的に分かるものか
        - アクロニムは原則不可
    - 一般的すぎる名称ではないか


### バージョンアップ

Project.tomlのバージョンを変更する

コミットしてgithubにpush
(注意:この時点でタグは付けない、register時に重複existing tagでエラーになる)

GitHubからコミットにアクセスしてコメント欄に
```@JuliaRegistrator register```

自動的にJuliaRegistoryへのPull requestが生成される

Pull requestが通ったらTagBotが自動的にタグとリリースとリリースノートを作成
