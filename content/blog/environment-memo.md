---
title: 作業環境構築メモ
dateCreated: 2020-05-19
dateModified: 2023-05-09
tags:
  - macOS
  - environment setup
---


### アプリケーション


#### 公式サイトからダウンロード

- Google Chrome
- Falcon
- Box
- Google Drive (自宅のみ)
- Zotero
- InkScape
- KNIME
- DeepL
- Tabula
- Julia
- Zoom
- Microsoft Office
- VSCode


#### App storeからダウンロード

- Taurine
- StuffIt Expander
- Microsoft Remote Desktop



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


#### Homebrew

```
mkdir .homebrew && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C .homebrew
brew update
brew doctor
```

- XQuartzが必要であればcaskで入れる。
- cmakeはmacにデフォルトでインストールされていない。C++ビルドに必須。
- OpenSSLも何かと必要(MacOSデフォルトはLibreSSL)
  - 実験ノートのタイプスタンプにも使うので最新版を入れてbrew linkしておく
- rsyncはmacデフォルトにもあるがbrewで3.0系を入れる
- noclamshellでクラムシェルモードを無効化

```
# brew cask install xquartz
brew install cmake
brew install openssl
brew link openssl --force
brew install rsync
brew install juliaup
brew install pirj/homebrew-noclamshell/noclamshell
brew services start noclamshell
```


#### VSCode

Extensionを入れる

- Japanese Language Pack
- Julia
- Markdown PDF
- Render Line Endings
- zenkaku


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

# poetry
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
# poetryにパスを通す
# Node風にローカルでパッケージを管理
poetry config virtualenvs.in-project true

# プロジェクトを新規作成する場合
poetry new [project名]

# 既にpyproject.tomlがある場合は、instantiateする
poetry install
```


以下、現状のローカル環境の構成:

```
poetry add numpy
poetry add pandas
poetry add scipy
poetry add scikit-learn

poetry add jupyter
poetry add jupytext

poetry add seaborn
poetry add plotly
poetry add kaleido  # plotly用

poetry add python-dotenv
poetry add PyYAML
poetry add simplejson
poetry add xlsxwriter
poetry add selenium
poetry add chromedriver-binary-auto  # Selenium用。自動で適切なバージョンのChrome driverが入る



### Julia

- Mac版公式アプリケーションをダウンロードしてインストール
- 実行可能バイナリにパスを通す(localenvの.zshrcに記載済み)
- デフォルトプロジェクトに必要なライブラリをインストール

```
add IJulia
add Revise

# add BinaryBuilder
# add PackageCompiler
# add Plots
# add MassInstallAction
```

Jupyterのカーネルが登録されているか確認

```
poetry run jupyter kernelspec list
```

カーネルが入ってないことがある?一旦プレコンパイルが必要?(要確認)

```
using IJulia
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


### PyMol

- TODO: ラボォ氏のテキストを参考に構築、もしくはDocker

```
brew install homebrew/dupes/tcl-tk --enable-threads --with-x11  # for PyMol
brew install python --with-brewed-tk  # for PyMol
brew install homebrew/science/pymol
```



### その他

- TODO: gromacsとかpsi4のdocker



### KNIME

Install KNIME Extensions...で下記拡張をインストール

#### 必須

- KNIME Python Integration

  Preferences->KNIME->Pythonという項目ができているので、Python3のところに.venv内のpythonのパスを設定する(browseからpythonを選択するとエイリアスではなく参照元が設定されてしまうので、.venv内のpythonのパスを手打ちする)

- KNIME Report Designer

  レポート自動化

- KNIME Data Generation

  データ生成(連番など)

- KNIME Base Chemistry Types & Nodes

  SDFile読み書きなど

#### 評価中

- KNIME Python Integration (Labs)
- KNIME Modern UI Preview
- KNIME Plotly

- KNIME Testing Framework UI

  テスト用ノード
  
- KNIME HCS Tools

  Z-score, RZ-score 不要かも

- KNIME Image Processing
- KNIME Image Processing - Python Extensions

  プレート統計、ヒートマップなど。まだ使うか微妙

- Streaming Execution

  ストリーミング(非同期実行)ができるようになる。


#### Windows編

基本的には上記そのままインストール可能

- Pythonはminicondaをインストーラでインストールして、minicondaルートを指定
- conda installで必要なライブラリをインストール
  - Plotlyはorcaにパスを通す必要あり
    - conda install -c plotly plotly-orca
    - Windowsの環境変数でminicondaのルートを指定
  - conda install seaborn



### Legacy

#### Atom

VSCodiumへ移行済み。以下2019年以前の設定。

設定ファイルの共有

```
cd ~/.atom
ln -s ~/Workspace/localenv/atom_settings/config.cson
ln -s ~/Workspace/localenv/atom_settings/styles.less
ln -s ~/Workspace/localenv/atom_settings/init.coffee
```

パッケージのインストール

- language-julia
- language-latex
- language-restructuredtext(不要？)
- latex
- linter
- linter-eslint
- linter-flake8
- linter-htmlhint
- show-ideographic-space
- split-diff
- rst-preview-pandoc(不要？)

テーマのインストール

- seti-ui アイコンが良い
- predawn-syntax 見やすい


#### その他旧conda時代のPython環境

condaは使わない。RDKitはDocker使用。

```
conda install rdkit -c rdkit  # vegaが先だとコンフリクトする？

# Python開発
conda install sphinx
# sphinxcontrib-napoleonはビルトインになった
conda install sphinx_rtd_theme
conda install twine -c conda-forge
conda install wheel -c conda-forge

# Networkx2対応python-louvain
pip install git+https://github.com/taynaud/python-louvain.git@networkx2
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