---
title: PyMOL,Gromacs,AutoDockVinaメモ
dateCreated: 2021-02-19
dateModified: 2021-02-19
tags:
  - PyMOL
  - Gromacs
  - AutoDockVina
  - environment setup
---


2014年ごろの情報なので注意。TODO: 情報の更新


### PyMOLインストール

Xquartz必須なのでなければインストール

```
brew tap homebrew/science
brew tap homebrew/dupes
```

#python, tcl, tkがすでにある場合は

```
brew uninstall python
brew uninstall tcl
brew uninstall tk

brew install apple-gcc42
brew install python —-with-brewed-tk --enable-threads --with-x11
```

- brew uninstall pythonするとpep8, mccabeなどがeggを残して消えてしまう模様
- これらも再インストールが必要

```
brew install pymol
```

- PyMOLの作業ディレクトリを作成しておく
- ホームディレクトリに.pymolrcファイルを作成する
- 起動時に作業ディレクトリに移動するよう.pymolrcに記述

```
cd /Users/ユーザ名/PyMOL/
set fetch_path, /Users/ユーザ名/PyMOL/PDB
```

- PDBからfetchしてきた構造ファイルの保存場所を指定
- /Users/ユーザ名/PyMOL/scriptフォルダなどを作っておきよく使うコマンドを保存しておくと便利
- PyMOLコマンドは拡張子pmlのテキストファイルで保存しておく
- Pythonで記述したpyファイルも読み込むことが可能


### Gromacsインストール

```
brew install gromacs # (homebrew/science必須。dupeも？)
```

### AutoDock Vinaのインストール(検証中)

http://vina.scripps.edu/download.htmlからMac用tgzを落とす  
解凍してvina, vina_splitを/usr/local/binに移動(パスの通ってるフォルダならどこでも)

MGLToolsのインストール  
http://mgltools.scripps.edu/downloadsからMac用dmgを落とす  
インストーラを起動してウィザードに従ってインストール

PyMolのAutoDockプラグイン(autodock.py)をインストール  
http://wwwuser.gwdg.de/~dseelig/adplugin.html  
PyMolのPluginからインストール

MGLToolsは専用のPythonインタプリタを使うので、/Library/MGLTools/1.5.6/MGLToolsPckgs/AutoDockTools/Utilities24フォルダにある

```
prepare_receptor4.py
prepare_flexreceptor4.py
prepare_ligand4.py
prepare_gpf4.py
prepare_dpf4.py
```

の一行目の

```
#!/usr/bin/env python
```

を全て下記のように書き換える

```
#!/usr/bin/env /Library/MGLTools/1.5.6/bin/pythonsh
```

FreeMOLが必要なのでインストール   
http://www.freemol.org/

- svnからtrunk/freemol/libpy/freemolフォルダをTarballから落として解凍
- /Library/MGLTools/1.5.6/lib/python2.5/site-packagesフォルダに置く

Vina Pluginの設定

AutoDockTools  
/Library/MGLTools/1.5.6/MGLToolsPckgs/AutoDockTools/Utilities24

vina executable  
/usr/local/bin/vina

Working Directoryは適当に
