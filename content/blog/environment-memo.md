---
title: 作業環境構築メモ
dateCreated: 2020-05-19
dateModified: 2020-05-26
tags:
  - Mac OS X
  - environment setup
draft: true
---


### 公式サイトからダウンロード

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



### App storeからダウンロード

- Taurine
- StuffIt Expander



### Homebrew

```
mkdir .homebrew && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C .homebrew
brew update
brew doctor
```

brew doctorでxcodeがなければインストールするか聞かれるので入れる。XQuartzはcaskで入れる。

```
brew cask install xquartz
```



### Python

pyenvとPoetryを使う(Poetry単独だと2.7系のシステムPythonを使おうとする)

```
# pyenv
brew install pyenv
pyenv install --list
pyenv install [listで確認したバージョン]
pyenv global [listで確認したバージョン]

# .zshrcでパスを通す
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.zshrc

# globalで使うパッケージ
pip install flake8

# poetry
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
# poetryにパスを通す
# node風にローカルでパッケージを管理
poetry config virtualenvs.in-project true

```

#### JupyterのExtension

NbextensionとJupyTextをいれる

```
poetry add jupytext
poetry add jupyter_contrib_nbextensions
poetry run jupyter contrib nbextension install --user
```


### Julia

.zshrcでパスを通す。

デフォルト環境にIJuliaをインストール

```
add IJulia
```

Jupyterのカーネルが登録されているか確認

```
jupyter kernelspec list
```


### Node.js

```
brew install node
npm install -g yarn
yarn global add eslint
```



### C/C++

cmakeはmacにデフォルトでインストールされていない。C++ビルドに必須(icu4cも?)。

```
brew install cmake
brew install icu4c
```


以下、condaからのマイグレーションTODO

```
conda install flake8
conda install jupyter
conda install jupyter_contrib_nbextensions -c conda-forge
conda install rdkit -c rdkit  # vegaが先だとコンフリクトする？
conda install vega -c conda-forge
conda install scikit-learn
conda install ghostscript  # MacTeX必須

# chorus依存
conda install networkx
conda install matplotlib
conda install cython
conda install numexpr
conda install pyyaml

# flashflood依存
conda install xlsxwriter

# Node.js
conda install nodejs -c conda-forge  # forgeの方が新しい
npm install eslint -g

# 開発依存
conda install sphinx
# sphinxcontrib-napoleonはビルトインになった
conda install sphinx_rtd_theme
conda install twine -c conda-forge
conda install wheel -c conda-forge

# devをデプロイする場合
pip install git+https://github.com/mojaie/chorus.git@dev
pip install git+https://github.com/mojaie/flashflood.git@dev
pip install git+https://github.com/mojaie/flashflood-workflow.git@dev
# kiwiii
npm install mojaie/kiwiii#dev

# pandasはrdkit等で入る
# tornado, pandocその他いろいろはjupyterで入る

conda install  julia -c conda-forge
# condaはアップデートが遅いのでdmgをインストールしてpath通した方がいいかも
```

その他マイグレーションTODO

```
# Networkx2対応python-louvain
pip install git+https://github.com/taynaud/python-louvain.git@networkx2

conda upgrade -n root conda
conda install -n root conda-build

# conda skeleton pypi sphinxcontrib-httpdomain
# conda build sphinxcontrib-httpdomain
# conda install --use-local sphinxcontrib-httpdomain

# 後片付け
conda build purge
conda clean --all

# サーバ用デーモン
pip install supervisor  # Python3未対応
echo_supervisord_conf > $HOMEBREW/etc/supervisord.conf
```

#### Supervisorメモ

- supervisord.confの中身を編集
- supervisordで起動
- 停止はソケットごと削除
- supervisorctl statusでステータス確認
- supervisorctl start <daemon>
- supervisorctl stop <daemon>
- supervisorctl restart <daemon>



### Atomの設定

#### 設定ファイルの共有

```
cd .atom
ln -s ~/Dropbox/workspace/atom_settings/config.cson
ln -s ~/Dropbox/workspace/atom_settings/styles.less
ln -s ~/Dropbox/workspace/atom_settings/init.coffee
```

#### パッケージ

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

#### テーマ

- seti-ui アイコンが良い
- predawn-syntax 見やすい



### LaTeX

- MacTeX公式からBasicTeX.pkgをダウンロードしてインストール
- /Library/TeX/texbinにパスを通す

```
sudo tlmgr update --self --all  # なんかエラー出る
sudo tlmgr install latexmk    # pdf出力 デフォルトで入ってない
sudo tlmgr install achemso    # ACSのフォーマット
sudo tlmgr install mhchem     # achemso必須
sudo tlmgr install chemgreek  # achemso必須
sudo tlmgr install mciteplus  # achemso必須
```



### PyMol

- TODO: ラボォの人のテキストを参考に構築

```
brew install homebrew/dupes/tcl-tk --enable-threads --with-x11  # for PyMol
brew install python --with-brewed-tk  # for PyMol
brew install homebrew/science/pymol
```



### その他

- TODO: gromacsとかpsi4のdocker
