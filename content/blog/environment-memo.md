---
title: 作業環境構築メモ
dateCreated: 2020-05-19
dateModified: 2020-08-09
tags:
  - macOS
  - environment setup
---


### アプリケーション


#### 公式サイトからダウンロード

- Sophos
- Tutanota
- Zoom
- Google Chrome
- Google Drive (自宅のみ)
- Dropbox
- Atom
- Sourcetree
- Mendeley Desktop
- InkScape
- Docker
- Knime
- Tabula
- Julia最新版


#### App storeからダウンロード

- Taurine
- StuffIt Expander



### 開発環境


#### localenv

localenvをcloneする。初回git使用時にコマンドラインツールのインストールを促されるのでインストールする。

```
cd ~/Workspace
git clone https://github.com/mojaie/localenv.git
```

.zshrcのシンボリックリンクを作成
```
cd ~
ln -s ~/Workspace/localenv/.zshrc
```


#### Atom

設定ファイルの共有

```
cd ~/.atom
ln -s ~/Workspace/localenv/atom_settings/config.cson
ln -s ~/Workspace/localenv/atom_settings/styles.less
ln -s ~/Workspace/localenv/atom_settings/init.coffee
```

パッケージのインストール

- langage-julia
- langage-latex
- langage-restructuredtext
- latex
- linter
- linter-eslint
- linter-flake8
- linter-htmlhint
- show-ideographic-space
- split-diff
- rst-preview-pandoc

テーマのインストール

- seti-ui アイコンが良い
- predawn-syntax 見やすい


#### Homebrew

```
mkdir .homebrew && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C .homebrew
brew update
brew doctor
```

XQuartzが必要であればcaskで入れる。

```
brew cask install xquartz
```


#### Python

- pyenvとPoetryを使う(Poetry単独だと2.7系のシステムPythonを使おうとする)
- Julia関連(IJuliaやPyCallなど)はなぜかConda.jlのpythonを推すので要検討

```
brew install pyenv
pyenv install --list
pyenv install [listで確認したバージョン]
pyenv global [listで確認したバージョン]

# .zshrcでパスを通す
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.zshrc

# flake8はAtomで使うのでglobalインストール
pip install flake8

# poetry
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
# poetryにパスを通す
# Node風にローカルでパッケージを管理
poetry config virtualenvs.in-project true

# それぞれのプロジェクトでpyproject.tomlをinstantiateする
poetry install
```

Jupyter notebookを使うプロジェクトを新規作成する場合

```
poetry new projectname
poetry add jupyter
poetry add jupytext
poetry add jupyter_contrib_nbextensions
```

poetry installだけでなく、Nbextensionの有効化が必要

```
poetry run jupyter contrib nbextension install --user
```

これでWebUIからnbextensionを設定できるので、ExecuteTime等を入れる


#### その他旧conda時代のPython環境

```
conda install rdkit -c rdkit  # vegaが先だとコンフリクトする？
conda install vega -c conda-forge
conda install scikit-learn

# Python開発
conda install sphinx
# sphinxcontrib-napoleonはビルトインになった
conda install sphinx_rtd_theme
conda install twine -c conda-forge
conda install wheel -c conda-forge

# Networkx2対応python-louvain
pip install git+https://github.com/taynaud/python-louvain.git@networkx2
```



### Julia

- Mac版公式アプリケーションをダウンロードしてインストール
- 実行可能バイナリにパスを通す(localenvの.zshrcに記載済み)
- デフォルトプロジェクトに必要なライブラリをインストール

```
add IJulia
add Revise
add BinaryBuilder
add PackageCompiler
add Plots
```

Jupyterのカーネルが登録されているか確認

```
jupyter kernelspec list
```


#### TODO: カスタムデフォルトsysimageからの起動

```
cd $LOCAL
create_sysimage(:Plots, sysimage_path="sysimage/sys_plots.dylib", precompile_execution_file="script/precompile_plots.jl")
```



### Node.js

```
brew install node
npm install -g yarn
yarn global add eslint
```



### C/C++

cmakeはmacにデフォルトでインストールされていない。C++ビルドに必須。
OpenSSLも何かと必要(MacOSデフォルトはLibreSSL)


```
brew install cmake
brew install openssl
```



### LaTeX

- MacTeX公式からBasicTeX.pkgをダウンロードしてインストール
- /Library/TeX/texbinにパスを通す
- TODO: brew cask install mactex
  - ghostscriptもこれで入るらしい

```
sudo tlmgr update --self --all  # なんかエラー出る
sudo tlmgr install latexmk    # pdf出力 デフォルトで入ってない
sudo tlmgr install achemso    # ACSのフォーマット
sudo tlmgr install mhchem     # achemso必須
sudo tlmgr install chemgreek  # achemso必須
sudo tlmgr install mciteplus  # achemso必須
```



### PyMol

- TODO: ラボォ氏のテキストを参考に構築

```
brew install homebrew/dupes/tcl-tk --enable-threads --with-x11  # for PyMol
brew install python --with-brewed-tk  # for PyMol
brew install homebrew/science/pymol
```



### その他

- TODO: gromacsとかpsi4のdocker



### KNIME

Install new software -> KNIME Python integrationを入れる

poetry newでknimeのワークスペースにpython環境を作る

```
poetry add numpy
poetry add pandas
```

KNIMEの環境設定で.venv内のpythonのパスを通す
