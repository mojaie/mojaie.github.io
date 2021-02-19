---
title: 化合物サーバ構築メモ
dateCreated: 2020-09-06
dateModified: 2020-09-06
tags:
  - environment setup
draft: true
---


### 現在の実装

- Kubernetesで構築
- APIサーバはTornado
- DBはPostgreSQLとPostgREST
  - データ登録はクライアントから実行可能
- ジョブキューはRabbitMQ
  - APIサーバからjobキューに処理を投げる
  - dispatcherがjobキューのタスクをバラしてworkerキューに投げる
  - workerがworkerキューからタスクを回収して実行しresultキューに投げる
  - writerがresultキューから結果を回収してファイルに書き込む
  - ジョブの処理結果はファイルで書き出してAPIサーバからGET
  - ジョブのコンシューマはpika+Tornado
- ワーカースレッド
  - MolecularGraph.jlの関数はライブラリをpythonから呼び出す
  - RDKitはdockerコンテナをベースに作成
- xlsxはワーカー扱い(非同期リクエストにするか、ジョブのようにファイルに書き出すか)
- 処理結果はresultフォルダに溜まり続けるので定期的にCronJobで削除する



### 検討したけどやめたこと

- Argo
  - APIが複雑になる
- AMQPClient.jlもしくはrabbitmq-c
  - Docker上では動くがなぜかKubernetes上ではconnectionがロストする
  - AMQPClient.jlとrabbitmq-cは現状イベントループ未実装なので実用に耐えない
- PyCallとpyjulia
  - 環境依存が大きい、バージョン間で不安定
