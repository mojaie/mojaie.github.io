---
title: jupyter_contrib_nbextensionsを削除する
dateCreated: 2020-10-19
dateModified: 2020-10-19
tags:
  - Python
  - Jupyter Notebook
---


### nbextensions

Jupyter Notebookに数々の拡張機能を追加できるnbextensionsですが、2020年10月時点で既にプロジェクトは不活発のようです。既にJupyterの最新版にはほとんどの拡張が対応していないので、あえて使用する意味はあまりなさそうです。

既にインストールしてしまっている場合は、下記の手順で削除可能です。インストールの際に`jupyter contrib nbextension install --user`を実行すると結構いろいろな場所にファイルを複製する仕様なので少し厄介です。


#### jupyter\_contrib\_nbextensionsをアンインストールする

まずjupyter\_contrib\_nbextensionsをアンインストールします。

pipの場合は

```
pip uninstall jupyter_contrib_nbextensions
```

poetryの場合は

```
poetry remove jupyter_contrib_nbextensions
```

です。


#### 関連ファイルを削除する

上記アンインストールを行っても、ユーザディレクトリにも設定ファイルが残っていてJupyter Notebook起動時に警告が出るので、個別に削除する必要があります。MacOSの場合以下のフォルダに設定ファイルがあります。

```
~/.jupyter
~/.ipython
~/Library/Jupyter
```

関連ファイルは大体nbextensionというフォルダにありますが、そうでないものもあり個別に消すのは結構面倒なので、pyenvやpoetryなどで仮想環境を使っている場合は上記フォルダごと全て削除し、仮想環境ごと再インストールするのが手っ取り早いです。
