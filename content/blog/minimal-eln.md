---
title: オープンソースでミニマルな電子実験ノート(ELN)を実装する
dateCreated: 2021-07-29
dateModified: 2021-08-09
tags:
  - electronic lab notebook
  - VSCode
  - trusted timestamping
---


### 要点

- 電子実験ノート(ELN)が欲しかったのでオープンソースのものでDIYしました
- VSCodeのMarkdown PDFは便利
- タイムスタンプはOpenSSLで作成できる
- クラウドストレージやspotlightの全文検索を活用しよう


### 環境

- MacOS 11.5
- VSCode 1.59.0
  - Markdown PDF 1.4.4
- OpenSSL 1.1.1h


### どうしてこうなった...

- [eLabFTW](https://www.elabftw.net/)を試用していたが、日本語環境の対応が遅れていて実用に耐えなかった。メジャーバージョンアップ時にデータベースが文字化けで死んだのでこれを機にやめた。
- そもそも実験ノートになぜサーバが必要なのか
- 書いたMarkdownがPDFになってタイムスタンプが押せればそれはELNと言えるのでは
- タグ付け、カテゴリ分けなどしなくてもspotlightやクラウドストレージの全文検索で検索すればいいのでは


### 最低限の機能

1. Markdownエディタ

   構造的な文書が平易な文法で書けるという点でほぼ一択なのかと思います。一応画像を貼ることもできるので写真やスペクトルデータの添付にも困りませんね。

1. タイムスタンプ認証局(TSA)の認証によるタイムスタンプの付与

   データの真正性の確保の点で電子実験ノートに必須の機能です。認証局のタイムスタンプがあることでファイルが特定の日時に存在していたことを証明でき、改竄を防ぐことができます。

1. 全文検索可能なデータベース

   たくさんのノートを引っ張り出して片っ端からページをめくらなくても、一瞬で検索できるのが電子実験ノートの強みです。


### VSCodeを使ってMarkdownで実験ノートを書く

VSCodeはデフォルトでMarkdownが書けます。F1メニューでPreview->画面分割してプレビューしながら編集できるのも良いですね。

画像はMarkdownだとサイズ変更できないので、imgタグで適当な大きさにします。直接エディタに画像をドラッグアンドドロップで貼り付けられるプラグインもあるようです。


### Markdown PDFプラグインでPDFに変換する

Markdown PDF  
https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf

Markdown PDFプラグインをインストールします(VSCodiumの場合はMarketplaceにないのでvsixでインストールします)。F1メニューもしくは右クリックメニューでExport (pdf)すると同じ階層にPDFが出力されます。


### タイムスタンプの作成

1. タイムスタンプ認証局(TSA)から公開鍵を取得します。今回は学術用途に限り無料で利用できるドイツ研究ネットワーク(Deutsche Forschungsnetz; DFN)の認証局を利用します。

   FAQ Zeitstempeldienst (ドイツ語です)  
   https://www.pki.dfn.de/faqpki/faq-zeitstempel/

   証明書チェーン  
   https://pki.pca.dfn.de/dfn-ca-global-g2/pub/cacert/chain.txt

1. 実験ノートPDFを元に、タイムスタンプのリクエストファイル(.tsq)を生成します。実質PDFのsha512ハッシュファイルです。

   ```
   openssl ts -query -data "210707_nice_experiment_1.pdf" -no_nonce -sha512 -cert -out "210707_nice_experiment_1.tsq"
   ```

1. タイムスタンプ認証局にタイムスタンプ発行リクエストを送信して、レスポンスファイル(.tsr)を受信します。

   ```
   curl -H "Content-Type: application/timestamp-query" --data-binary '@210707_nice_experiment_1.tsq' http://zeitstempel.dfn.de/ > "210707_nice_experiment_1.tsr"
   ```

1. リクエストとレスポンスを照合して、有効なタイムスタンプが付与されたかどうかを確認します。CAfileオプションの値はルート認証局のCAファイルの場所で、MacOSのデフォルトは多分`/private/etc/ssl/cert.pem`です。untrustedオプションの値はTSAから取得した証明書チェーンの場所になります。

   ```
   openssl ts -verify -in "210707_nice_experiment_1.tsr" -queryfile "210707_nice_experiment_1.tsq" -CAfile /private/etc/ssl/cert.pem -untrusted ./sign-verify/chain.txt
   ```

   OKと表示されれば有効なタイムスタンプが付与されています。

1. タイムスタンプの中身を確認する

   レスポンスファイルの中身を解析すると、タイムスタンプの発行日時が確認できます。

   ```
   openssl asn1parse -in "210707_nice_experiment_1.tsr" -inform DER
   ```

   signingTimeという項目を検索すると発行日時を見つけることができます。

   ```
   5959:d=8  hl=2 l=   9 prim: OBJECT            :signingTime
   5970:d=8  hl=2 l=  15 cons: SET               
   5972:d=9  hl=2 l=  13 prim: UTCTIME           :210708080021Z
   ```


### 実験ノート、データの保管と検索

作成したPDFとタイムスタンプ関連ファイルをクラウドに保管します。ファイル名の命名規則やフォルダ構造で、時系列あるいは分類別などで整理して保管します。

Google Drive、Boxなどの大規模商用クラウドは高速な全文検索エンジンが搭載されているので、下手な自前サーバよりも高速でPDFやMarkdownを検索し、実験条件や試薬など細かい条件を見つけ出すことができます。日本語の検索にも強いです。クラウドが利用できない環境では、MacのSpotlightを活用すると同様の検索が可能です。



### 課題

- タイムスタンプの有効期限
- 事務方に「ノートを確認したいから紙媒体で提出しろ」と言われた時の対応