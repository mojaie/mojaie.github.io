---
title: MassInstallActionでJuliaパッケージのCI環境を整備する
dateCreated: 2020-01-31
dateModified: 2021-01-31
tags:
  - Julia
  - package manager
  - package development
---

2021年1月時点で、Travis等を使用する従来のCIワークフローからGitHub Actionへの移行が徐々に進んでいます。MassInstallActionというパッケージを使うと複数のライブラリのCIワークフローを自動的にGitHub Actionへ移行することができます。


### MassInstallActionのインストール

以下、REPLでの操作です。GitHubやHTTPパッケージがなければインストールしておきます。

```Julia
(@v1.5) pkg> add MassInstallAction
(@v1.5) pkg> add GitHub
(@v1.5) pkg> add HTTP
```

### MassInstallActionの実行

プロジェクトフォルダに移動してREPLを起動し、activateします。 
GitHubでアクセストークンを生成しておきます。Settings->Developer settings->Personal access tokens->Generate new tokenでトークンを生成してコピーし、REPLで下記コードを実行します。MassInstallActionを適用したいリポジトリをrsに配列で格納します。

```Julia
julia> using GitHub, MassInstallAction
julia> import HTTP
julia> auth = authenticate("GitHubのアクセストークン")
julia> rs = [repo(Repo("mojaie/MolecularGraph.jl"); auth=auth)]
```

下記リンクのMassInstallActionデモコードから必要なものを実行します。  
https://github.com/julia-actions/MassInstallAction.jl/blob/dec8ce995d707b0008c0b1e47f93f7bcbad2d877/demos/MaintenanceDec2020/maintenance.jl

- Key/secret creation

  Documenter.jlのデプロイに必要なDOCUMENTER_KEYとdeploy keyを生成してGitHubに登録します(すでにキーがある場合はスキップします)。TagBotもこれらを使用するのでDocumenterを使っていなくても生成されます。

以下は、デモコードを実行するとプロジェクトの.github/workflowsに当該ワークフローのyamlファイルを追加したプルリクエストが自動的に作成されます。

- TagBot

  以前は1時間おきにbotが巡回して新しいバージョンのタグのチェックをするワークフローでしたが、レジストリに登録された際にトリガーされて自動的に新しいバージョンのタグが付与されるようになりました。

- Documenter

  masterブランチへのpush時に自動的にDocumenterがデプロイされてドキュメントが自動生成されるワークフローを作成します。

- CI

  プロジェクトにtravis.yamlがある場合はその情報を元にGitHub Actionでユニットテストを実行するワークフローを作成します。


### 謝辞

Tim Holy氏にGitHubのissueにて御指南いただきました。ありがとうございました。
https://github.com/mojaie/MolecularGraph.jl/issues/51