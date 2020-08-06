---
title: 作業環境構築メモ
dateCreated: 2020-05-19
dateModified: 2020-05-26
tags:
  - macOS
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
# pyproject.tomlの作成
poetry new projectname
poetry add jupyter
poetry add jupytext
poetry add jupyter_contrib_nbextensions

# 既にpyproject.tomlがある場合
poetry install
```

```
poetry run jupyter contrib nbextension install --user
# これでWebUIからnbextensionを設定できるので、ExecuteTimeを入れる
```


以下、condaからのマイグレーションTODO

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

cmakeはmacにデフォルトでインストールされていない。C++ビルドに必須。

```
brew install cmake
```



### Atomの設定

#### 設定ファイルの共有

```
cd .atom
ln -s $LOCAL/atom_settings/config.cson
ln -s $LOCAL/atom_settings/styles.less
ln -s $LOCAL/atom_settings/init.coffee
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

- TODO: ラボォの人のテキストを参考に構築

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
