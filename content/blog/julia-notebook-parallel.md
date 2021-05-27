---
title: Jupyter NotebookでJuliaをマルチスレッドで実行する
dateCreated: 2021-05-27
dateModified: 2021-05-27
tags:
  - Julia
  - Jupyter Notebook
---

Juliaをマルチスレッドで動かす場合は起動時にスレッド数を指定しておく必要があります。Jupyter Notebookでマルチスレッドを使用する場合は、新しくマルチスレッド用のカーネルをインストールします。


```julia
using IJulia
installkernel("Julia (4 threads)", specname="julia-4-threads", env=Dict("JULIA_PROJECT"=>"@.", "JULIA_NUM_THREADS"=>"4"))
```

最初の引数は表示名(Notebookで表示される名前)です。表示名に括弧などハイフン以外の記号がある場合はspecnameで英数字+ハイフンの名前を指定してください。IJuliaインストール時に作成されるデフォルトカーネルではjuliaコマンドの引数に`--project=@.`が指定されていますが、installkernelでインストールした場合はNotebook起動時のプロジェクトがデフォルトプロジェクトになってしまうので、envに`"JULIA_PROJECT"=>"@."`を渡しておくと良いです。


### 参考

Jupyter Notebook multithreading #882
https://github.com/JuliaLang/IJulia.jl/issues/882

Set JULIA_PROJECT="@." for kernel #820
https://github.com/JuliaLang/IJulia.jl/pull/820