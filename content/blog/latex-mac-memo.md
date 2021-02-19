---
title: LaTeXメモ (macOS)
dateCreated: 2021-02-19
dateModified: 2021-02-19
tags:
  - macOS
  - LaTex
  - environment setup
---


2014年ごろの情報なので注意。TODO: 情報の更新


### LaTeX導入

```
brew update

brew install ghostscript  # Ghostscript 9.07
brew install imagemagick  # Imagemagick 6.8.7-7
```

- http://www.tug.org/mactex/index.html からMacTeX-2013(MacTeX.pkg)をダウンロード
- インストーラ起動
- カスタマイズでTeXLiveのみインストール
- http://pages.uoregon.edu/koch/texshop/obtaining.html からTexShop3.26をダウンロード
- TexShopをアプリケーションフォルダに移動
- TexShopの設定でデフォルトタイプセットをXeLaTeXに変更
  - UTF-8準拠でギリシャ文字や特殊記号がそのまま貼れる
  - texファイルの文字コードデフォルトもUTF-8に変更しておく
- TexShop以外にもLyxを試してみたが中途半端にWYSIWYGで微妙に使いにくい


### Pandocでwordへ変換

```
brew install haskell-platform
cabal update
cabal install pandoc
```

- cabalのbinはなぜか~/.cabal/binにあるので、.bash_profileでパスを通しておく
- 一部のプリアンブルしか認識してくれないので実用性は乏しい


### Tex設定

```tex
% !TEX encoding = UTF-8 Unicode
\documentclass{scrbook}  % 製本用フォーマットを使用

\usepackage[dvipdfmx]{graphicx}  % 図表の貼付け(png, pdf等)
\usepackage{fontspec}  % Unicode用フォントの使用
\usepackage[version=3]{mhchem}  % 化学組成式記述用
\usepackage{multirow}  % 表組の行結合
\usepackage{threeparttable}  % 表組の脚注
\usepackage{natbib}  % 文献
\usepackage{comment}  % コメントアウト

\setromanfont{Times}  % Unicode用デフォルトフォント
\setcounter{secnumdepth}{4}  % subsubsectionでセクション番号を表示
\bibliographystyle{plainnat}  % 文献参照のスタイル
```

- pdfを貼り付ける際はxbbファイルを生成する必要がある。
- /usr/local/texlive/2013/bin/x86_64-darwinにパスを通して`extractbb hogehoge.pdf`
- 図表貼り付けの際はauxファイルを再生成する必要があるため、2回タイプセットする

- 文献参照を貼り付けるには予めMendeley等でbibファイルを生成しておく必要がある
- texmf-local/bibtex/bib,bstからbib,bstファイルのあるフォルダにシンボリックリンクを貼る

```
sudo ln -s /Users/smatsuoka/Dropbox/library/bibtex/bib /usr/local/texlive/texmf-local/bibtex/bib/dropbox
sudo ln -s /Users/smatsuoka/Dropbox/library/bibtex/bst /usr/local/texlive/texmf-local/bibtex/bst/dropbox
```

- 設定を反映

```
sudo mktexlsr
```

- 文献参照を更新する際はxelatexでタイプセットしてauxファイルを生成し、
- 続いてbibtexでタイプセットしてbblファイルを生成、さらにxelatexで２回タイプセット
- bblファイルをCtrl+Command+Aの自動削除に含めるために以下コマンドを打つ

```
defaults write TeXShop OtherTrashExtensions -array-add "bbl"
```
