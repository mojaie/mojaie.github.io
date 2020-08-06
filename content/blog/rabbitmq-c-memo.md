---
title: rabbitmq Cクライアントメモ
dateCreated: 2020-08-05
dateModified: 2020-08-05
tags:
  - C
  - rabbitmq
---

### 環境

- MacOS 10.15.5
- Docker desktop 2.3.4.0
- HomeBrew、CMakeがインストール済み(brew install cmake)


```
brew install popt
brew install openssl

git clone https://github.com/alanxz/rabbitmq-c.git
cd rabbitmq-c
mkdir build && cd build

cmake -DOPENSSL_ROOT_DIR=[ホームディレクトリ]/.homebrew/opt/openssl -DOPENSSL_INCLUDE_DIR=[ホームディレクトリ]/.homebrew/opt/openssl/include -DOPENSSL_LIBRARIES=[ホームディレクトリ]/.homebrew/opt/openssl/lib -DBUILD_TOOLS_DOCS=OFF -DBUILD_EXAMPLES=OFF -DBUILD_API_DOCS=OFF -DBUILD_TESTS=OFF ..

cmake --build .
```

- HomeBrewのopensslの場所はoptディレクトリで指定する
- poptとopensslはオプション。不要なら対応するコンパイルオプションをOFFにする
- toolsをインストールするとtoolsフォルダに実行可能バイナリが生成される
  - amqp-declare-queueコマンドでキューを作成
  - amqp-publishでデータをキューに送る
  - amqp-consumeでデータを取得する
  - docker環境では問題なく動くが、MacOSではkubernetesにデプロイした時のみ上記コマンド使用時なぜか接続がロストする(調査中)、Pythonクライアントだと問題なく接続できる
- 基本的に同期接続（ログインとHeartbeat以外ほとんど）で、queueがfull時のtimeoutなどを設定してもあまり効果はない模様。非同期接続は他のクライアント(e.g. Pythonクライアントのpika)を使うか、自前で実装する必要がある。
