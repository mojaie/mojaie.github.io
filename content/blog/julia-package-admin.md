---
title: Juliaパッケージ管理メモ
dateCreated: 2020-02-24
dateModified: 2021-08-30
tags:
  - Julia
  - package manager
  - package development
---

Juliaのパッケージ管理のメモです。


### JuliaRegistratorのインストール

JuliaRegistratorはGitHub appsで、下記サイトからインストールする。パッケージの更新(新規作成またはバージョンアップ)を公式レジストリに知らせるツール。

https://github.com/JuliaRegistries/Registrator.jl


### GitHub Workflow

プロジェクトページの.github/workflowsに作成する(作成される?)
Personal access tokenを使ってGitHubにアクセスしている場合はScopeでWorkflowにチェックを入れておかないと、.github/workflowsにpushできない

- TagBot: 新しいバージョンをRegistratorで登録すると、自動的にリリースタグを作成してくれる。Registrator経由で公式リポジトリに新しいパッケージが登録された際に、JuliaTagBotが当該パッケージのリポジトリにissueを書き込みTagBotをトリガーする。
- Documenter: ドキュメントを自動生成する。通常masterへのコミットやバージョンアップでトリガーされるようになっている。
- CompatHelper: 定期的に公式リポジトリを確認しに行って、当該パッケージに互換性の問題が生じていたら知らせてくれる。
- CI: プルリクエストが作成された時に自動的にテストしてカバレッジなどを教えてくれる。


デプロイキーはDocumenterのものを使い回すと楽。DocumenterToolsがSSHキーを生成してくれる。

```
using DocumenterTools
DocumenterTools.genkeys(user="username", repo="NicePackage.jl")
```

最初に表示される公開鍵は、リポジトリ設定のDeploy Keyに登録する。次に表示される秘密鍵は、リポジトリ設定のSecretにDOCUMENTER_KEYという名前で登録する。TagBotも公式ドキュメントではDOCUMENTER_KEYを使って自動デプロイする設定になっている。


TagBotがエラーでタグを作成できなかった時、手動でワークフローをトリガーして修正できるのはデフォルトで3日間である。それ以上時間が経ってしまった時は、TagBot.ymlのonのところに以下のようにlookbackの記述を入れると、手動で実行する際にコミットを遡れる期間を指定できるようになる。

```
on:
  issue_comment:
    types:
      - created
  workflow_dispatch:
    inputs:
      lookback:
```


### MassInstallAction

JuliaのCI周辺は動きが激しく(Travisが突然商用になったり)、デプロイ環境が安定しないので、時々有志の環境整備ツールが供給される。ありがたや。

参照: [MassInstallActionでJuliaパッケージのCI環境を整備する](../julia-package-action)


### パッケージの登録、バージョンアップ

- Project.tomlのバージョンを変更する
- コミットしてgithubにpush(タグはProject.tomlの記述に基づいてTagBotが自動的に作成するので、手動でやらないよう注意)
- GitHubからコミットにアクセスしてコメント欄に```@JuliaRegistrator register```
- 自動的にJuliaRegistoryへのプルリクエストが作成される
- プルリクエストが通ったらTagBotによって自動的にタグ、リリース、リリースノートを作成される


#### 新規パッケージの場合

新規パッケージを登録するプルリクエストは、一定期間は登録が保留され、レジストリ管理者らによるレビューが行われる。

- 類似したパッケージが既にレジストリに登録されていないか
- 命名規則
    - パッケージ名は原則キャメルケース
    - 名前が長すぎないか
    - パッケージの内容が端的に分かるものか
        - アクロニムは原則不可
    - 一般的すぎる名称ではないか

問題がない、もしくは適切な修正を施してマージされるとパッケージが登録される。


#### バージョンアップの場合

新規パッケージと同様の流れだが、CIのテストを全てパスし、Package.tomlに記載されたパッケージとその依存モジュールのバージョンがセマンティックバージョニングに従っていれば自動的にマージされる。

バージョンをスキップしている(数値の増分が1でない)場合、自動マージされないので注意が必要。

- 例) 1.0.3->1.0.5のバージョンアップは1.0.4をスキップしているので自動マージされない

依存モジュールのバージョン指定に上限が無い場合は自動マージされないので注意が必要。特にメジャーリリース番号が0の場合、マイナーリリース番号の上限を指定しないとだめなので注意(0は正式リリースではないのでマイナーリリース間に互換性が無いとみなされる)。

- 例) "1"は自動マージされる(1.0.0以上2.0.0未満の間で互換性がある)
- 例) "0"だと自動マージされない(0.0.0以上1.0.0未満だが、0.0〜0.∞の間に無数の互換性の無いバージョンが存在しうる)
- 例) "0.14"は自動マージされる(0.14.0以上0.15.0未満の間で互換性がある)