---
title: 作業環境構築メモ
dateCreated: 2020-05-19
dateModified: 2025-01-08
tags:
  - macOS
  - environment setup
---

### アプリケーション

#### 公式サイトからダウンロード

- Google Chrome
- Zotero
- Zoom
- VSCode
- Office 365
- KNIME

- Cytoscape
- InkScape
- DeepL
- Tabula


#### App storeからダウンロード

- Slack
- Taurine
- Windows App (旧Remote Desktop)

- Okta Verify
- StuffIt Expander


### 開発環境

#### localenv

localenvをcloneする。初回git使用時にコマンドラインツールのインストールを促されるのでインストールする。

```
cd ~/Workspace
git clone https://github.com/mojaie/localenv.git
```

localからホームにシンボリックリンクを作成

```
cd ~
ln -s ~/Workspace/localenv/.zshrc
cd .ssh
ln -s ~/Workspace/localenv/ssh/config
```

#### Git

pushするにはGitのユーザ名とメールアドレスの設定が必要

```
git config --global user.name "User name"
git config --global user.email "user@email.com"
```

#### VSCode

Extensionを入れる

- Git Graph
- Hex Editor
- Japanese Language Pack
- Markdown PDF
- Render Line Endings
- zenkaku

- Markdown Preview Mermaid Support
- Prettier
- YAML (評価中)
- Julia (保留)

#### Homebrew

- Apple Siliconはデフォルトが`/usr/local`ではなく`/opt/homebrew`
- globalインストール
  - `/usr/local`に既にあるファイルフォルダの権限を変更するので注意が必要(全てwritable、ユーザはインストールユーザ、グループはadmin)
- もしくは`~/.homebrew`にローカルインストールする
  - マルチユーザ環境の場合`/usr/local`は避ける
  - ローカル環境の欠点としてはbottleを使えずビルドが必要なパッケージが多いのでインストールに相当な時間がかかる(pythonなど)

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew doctor
```

- XQuartzが必要であればcaskで入れる(おそらく不要)。
- cmakeはmacにデフォルトでインストールされていない。C++ビルドに必須。
- OpenSSLも何かと必要(MacOSデフォルトはLibreSSL)
  - 実験ノートのタイプスタンプにも使うので最新版を入れてbrew linkしておく
- rsyncはmacデフォルトにもあるがbrewで3.0系を入れる

```
brew install rsync  # localインストールはopensslビルドするのでかなり時間がかかる
brew link openssl --force  # LibreSSLからの切り替え、要シェル再起動 ->Apple Siliconでは不要になってる

brew install juliaup  # Julia環境
brew install rye  # Python環境

brew install node  # localインストールはかなり時間かかる
brew install cmake  # localインストールはかなり時間かかる

# brew cask install xquartz  # 現在はおそらく不要
# brew install pirj/homebrew-noclamshell/noclamshell  # ディスプレイ使うことが少なくなったので不要
# brew services start noclamshell  # 同上
```


#### Python (Rye)

- PyPIのHatchは扱いにくいのでRyeをインストール

```sh
rye init <project name>  # プロジェクト作成
rye pin 3.10  # syncでこのバージョンのPythonが入る、場所は~/.rye
rye sync  # .venv作成、切り替え
rye add <package>  # パッケージインストール
```

- `rye run`で仮想環境内からコマンド実行
- 爆速なので仮想環境切り替えというよりその都度pin->syncし直せばよさそう
- TODO: おそらくRyeの不具合で、ローカルパッケージの相対パスが効かない。
  - https://github.com/astral-sh/rye/issues/912
  - 次のバージョンで修正されると思うが、上記issueに解決策が出ていて、手動でpyproject.tomlにPROJECT_ROOTを指定すれば問題ない。
  - `streamlit @ file:///${PROJECT_ROOT}/temp/streamlit-1.29.0.tar.gz`
- pyproject.tomlにworkspace(例えばlocalenv)の設定をするとworkspace内の開発中のパッケージがその都度更新を反映するので便利
  - パッケージングの必要がないworkspace最上階フォルダは`virtual=true`にする
  - Workspaceでシンボリックリンクが認識されない->バグ
  - 当面はassay-spec-utilsはlocalenvのサブパッケージとして扱う


#### Julia

- 実行可能バイナリにパスを通す(localenvの.zshrcに記載済み)
- instantiateでlocalenvの依存パッケージをインストール(Project.tomlに記載)

```
pkg> instantiate
```

Jupyterのカーネルが登録されているか確認

```
rye run jupyter kernelspec list
```

カーネルが入ってないことがある?一旦プレコンパイルが必要?(要確認)

```
using IJulia
```


#### Node.js

- TODO: 情報が古いので要確認

```
npm install -g yarn
yarn global add eslint
```


#### PyMol

- TODO: 調査

```
brew install homebrew/dupes/tcl-tk --enable-threads --with-x11  # for PyMol
brew install python --with-brewed-tk  # for PyMol
brew install homebrew/science/pymol
```



#### その他

- TODO: gromacsとかpsi4のdocker



### 開発環境(Legacy)

#### Python (pyenv+poetry)

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
```


#### KNIME

Version 5でBIRTベースのreportingが廃止になり、大半のワークフローはStreamlitに移行したので今後使わないかもしれない。

No-codeアプリ開発を習得できるレベルの人員がそれなりに多い組織でないと機能しないし、科学技術用途はビジネス用途に比べて定型解析が少ないので最初からPythonを教育したほうがいい。

Install KNIME Extensions...で下記拡張をインストール

##### 必須

- KNIME Python Integration

  Preferences->KNIME->Pythonという項目ができているので、Python3のところに.venv内のpythonのパスを設定する(browseからpythonを選択するとエイリアスではなく参照元が設定されてしまうので、.venv内のpythonのパスを手打ちする)

- KNIME Report Designer

  レポート自動化

- KNIME Data Generation

  データ生成(連番など)

- KNIME Base Chemistry Types & Nodes

  SDFile読み書きなど

##### 評価中

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


##### Windows編

基本的には上記そのままインストール可能

- Pythonはminicondaをインストーラでインストールして、minicondaルートを指定
- conda installで必要なライブラリをインストール
  - Plotlyはorcaにパスを通す必要あり
    - conda install -c plotly plotly-orca
    - Windowsの環境変数でminicondaのルートを指定
  - conda install seaborn


#### 旧conda時代のPython環境

(2024年現在)condaはライセンス条件が安定しないのでインストール禁止。RDKitはDocker使用。

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


#### LaTeX

TeXはOverleafの方が良い

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