---
title: RDkitビルド職人の朝は早い (macOS)
dateCreated: 2021-02-19
dateModified: 2021-02-19
tags:
  - RDKit
  - macOS
  - environment setup
---


2016年ごろの情報なので注意。TODO: 情報の更新


### Boost

```
brew install boost #多分ダメ
```

- rdkit用にはpythonとregexだけでいいけど、brewは全てのライブラリをビルドする
- boostをHomebrewのcacheから持ってくる

```
tar xvf boost-1.56.0.tar.bz2
cd $BOOST_HOME
#user-config.jamを~に置いて編集
using python : 3.4 : /Users/smatsuoka/.homebrew/Frameworks/Python.framework/Versions/3.4/ : /Users/smatsuoka/.homebrew/Frameworks/Python.framework/Versions/3.4/Headers : /Users/smatsuoka/.homebrew/Frameworks/Python.framework/Versions/3.4/lib ;

./bootstrap.sh --with-libraries=python,regex --prefix=$HOMEBREW/.local/boost
./b2
```

- bash_profileにBoostのパスを追記


### RDkitビルド

githubからFork

```
cd $RDBASE
mkdir build
cd build
cmake -DBOOST_ROOT=$BOOST_HOME -DBOOST_LIBRARYDIR=$BOOST_HOME/stage/lib -DBOOST_INCLUDEDIR=$BOOST_HOME/boost -DPYTHON_LIBRARY=$PYTHON_HOME/lib/libpython3.4.dylib -DPYTHON_INCLUDE_DIR=$PYTHON_HOME/Headers -DPYTHON_EXECUTABLE=$PYTHON_HOME/bin/python3 -DPYTHON_NUMPY_INCLUDE_PATH=$PYTHON_HOME/lib/python3.4/site-packages/numpy/core/include ..
make
make install
```

インストールできず  
- おそらくHomebrewのBoostがデフォルトでlibstdc++を読み込むのが原因
- 念のためbrew install boostしてotoolで確認する -> libc++だった
- marvericks特有らしい
```
otool -L ./stage/lib/libboost_python3.dylib
```

- 他のMacでコンパイルしたlibboostをコピーすれば多分いけるはず
 - いけたlibboostのパスをDYLD_LIBRARY_PATHに追加する必要がある


