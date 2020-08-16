---
title: 不要なJuliaのパッケージを削除して空き容量を確保する
dateCreated: 2020-05-31
dateModified: 2020-08-16
tags:
  - Julia
  - package manager
  - environment setup
---

しばらくJuliaを使っているとホームディレクトリの.juliaフォルダに保管されたパッケージやアーティファクト(パッケージとして利用できるビルド済みバイナリ)が増えてきてディスク容量を圧迫しはじめます(Mac OS Xの場合、このMacについて->ストレージ->管理でディスク使用量が確認できます)。


### 不要なパッケージをプロジェクトから削除

remove(rm)コマンドで不要なパッケージをプロジェクトから削除します。Project.tomlからパッケージが削除されます。

```
(@v1.5) pkg> activate path/to/myproject
(myproject) pkg> rm MyPackage
```

REPL起動時のデフォルトのプロジェクトのProject.tomlは .julia/environments/[juliaのバージョン] フォルダにあります(npmで言うところのグローバル)。ここには古いバージョンのデフォルトのプロジェクトのパッケージが残っている場合があるので、\@v1.3, \@v1.4のような古い環境をactivateしてから当該パッケージを削除します。

```
(@v1.5) pkg> activate @v1.4
(@v1.4) pkg> rm MyOldPackage
```

v1.4以前は`activate --shared v1.3`のように--sharedオプションをつける必要がありました。


### プロジェクトで使用されていないパッケージとアーティファクトを削除

gcコマンドを実行すると、長らく使用されていないパッケージとアーティファクトが削除されます。allオプションを付けると使用されていない期間にかかわらず.julia/environmentsのProject.tomlに記載されていない全てのパッケージと関連するア＝ティファクトが削除されます。

```
(@v1.5) pkg> gc
```


詳細についてはPkg.jlのドキュメント参照  
https://julialang.github.io/Pkg.jl/v1/
