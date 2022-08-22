---
title: pyenvでlzmaがない警告 (MacOS)
dateCreated: 2022-08-22
dateModified: 2022-08-22
tags:
  - pyenv
  - Python
---

### 環境

- MacOS Monterey 12.5.1
- pyenv 2.3.3
- Python 3.10.6

### 現象

pyenvでpython 3.10.6をインストール

```
pyenv install 3.10.6
```

以下出力。lzma libがないのでは?というwarningが出る。

```
python-build: use openssl@1.1 from homebrew
python-build: use readline from homebrew
Downloading Python-3.10.6.tar.xz...
-> https://www.python.org/ftp/python/3.10.6/Python-3.10.6.tar.xz
Installing Python-3.10.6...
python-build: use tcl-tk from homebrew
python-build: use readline from homebrew
python-build: use zlib from xcode sdk
WARNING: The Python lzma extension was not compiled. Missing the lzma lib?
Installed Python-3.10.6 to /Users/hogehoge/.pyenv/versions/3.10.6
```


### 解決

公式トラブルシューティング  
https://github.com/pyenv/pyenv/wiki

```
brew install openssl readline sqlite3 xz zlib tcl-tk
```

これらは既に最新版がインストールされている。xzがlzmaに相当するものだが、どうもビルドの時にlzmaのincludeとlibが認識されていないようである。


Problem with lzma module #28219  
https://github.com/pyenv/pyenv/issues/1800


一旦pyenv uninstallしてから、上記issueのコメント通りCFLAGSとLDFLAGSを指定して再インストールすると警告が表示されなくなった。

```
CFLAGS="-I$(brew --prefix xz)/include" LDFLAGS="-L$(brew --prefix xz)/lib" pyenv install 3.10.6
```
