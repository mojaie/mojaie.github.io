---
title: InChI実装メモ
dateCreated: 2020-06-25
dateModified: 2020-06-25
tags:
  - chemoinformatics
  - molecular graph
  - molecular descriptor
  - C
  - Julialang
---

### InChIについて

- IUPACとNISTが開発し、InChI Trustが開発継続中
- InChI Trust https://www.inchi-trust.org
- InChIは化学構造式から一意に決まる文字列
  - 同じ構造式からは必ず同じInChIが生成される
  - 異なる構造式から同じInChIが生成されることはない
- 文字列比較で化学構造の完全一致が検出できる -> DBのインデックスとして使える
- 可変長文字列なので取り扱いにくい
- 実用上は固定長のハッシュであるInChI keyが利用される
  - ハッシュの衝突は実用上問題にならないくらい低頻度(PubChem数百万化合物程度では衝突しない)
  - 分子のサイズが大きくなるほど衝突の確率は上がる
- 同じ構造式でもデータ形式が異なるとInChIは一致しないことがある
  - データベースの統合時にはInChIの生成方法も統一することが重要
- InChIの文字列は組成式、グラフ記述、水素数、...のように構造式の構成要素(レイヤーと言う)を並べたもの
- 分子グラフの文字列変換方法
  - Canonical SMILESと同様にMorgan法に近い手順でノード番号を振る
  - 計算量オーダーはグラフ同型性問題に準ずる(多項式時間ではおそらくない)
  - とはいえ、低分子化合物で速度が問題になることはない
- InChIおよびInChI keyから構造の部分一致を知ることはできない
  - ただし、異性体レイヤーだけが異なるInChIから異性体の関係を知ることはできる


### 実装

Downloads of InChI Software  
https://www.inchi-trust.org/downloads/

- InChI trustの公式サイトでバイナリをダウンロード、もしくはソースをビルド
- ライセンスは独自ライセンスだが、LGPLよりは緩いとのこと

元のコードはプラットフォームごとにコンパイルのパラメータが異なりややこしい(しかもMacOSは対応していない)ので、CMakeFileを書いて下記リポジトリで公開しています。元のソフトウェアにはWindows用にInChI生成とノードインデックスの確認などができるGUIが搭載されていますが、こちらはAPIのライブラリファイルのみです。

libinchi (InChI version 1.05 fork for cross-platform build of InChI API)
https://github.com/mojaie/libinchi

このリポジトリを元に作成したJulia用のバイナリ(libinchi\_jll.jl)をJuliaBinaryWrappersに登録しています。Julia REPLのPkgモードから`add libinchi_jll`でインストールできます。

libinchi_jllはMolecularGraph.jlからも利用可能です。

MolecularGraph.jl  
https://github.com/mojaie/MolecularGraph.jl


### 参考情報

- Technical FAQ
https://www.inchi-trust.org/technical-faq-2/
- Compiling InChI to WebAssembly Part 1: Hello InChI  
https://depth-first.com/articles/2019/05/15/compiling-inchi-to-webassembly-part-1/
