---
title: Squidでプロキシサーバを構築する
dateCreated: 2020-07-11
dateModified: 2020-08-15
tags:
  - Squid
  - Ubuntu
  - Chrome
  - remote
  - environment setup
---

職場からしかアクセスできないシステム(IPでアクセス制限がかかっている)を自宅からVPN経由で使うためプロキシサーバを建てたときの備忘録。


### 前提

- VPNクライアントは職場から提供されている
- 職場のUbuntu 16.04にプロキシサーバをインストール
- アクセスしたいシステムは職場とは別のドメインにあり、登録された職場のIPアドレスからしかアクセスできない


### Squidのインストール

```shell-session
(サーバ側)
$ sudo apt install squid
```

### confファイルの編集

```shell-session
(サーバ側)
$ sudo vi /etc/squid/squid.conf
```

最低限編集が必要なのは以下2ヵ所のみ

```
acl localnet src 172.16.0.0/12
```

aclの行に接続を許可するホストがコメントアウトされている場合はコメントアウトを外します。
同じネットワークに属するコンピュータからのアクセスを受付けるため、acl localnetの行のうち該当する行のコメントアウトをはずす。

```
http_access allow localnet
```

上記のコメントアウトをはずして、localnetという名前で定義されたホストのHTTPアクセスを許可する。

confファイルを編集し終わったら、一旦squidを再起動します。

```shell-session
$ systemctl reload squid
```

以上。デフォルトのポートは3128なので、クライアントから-xオプションを指定したcurlで通信ができているかどうか確認する(プロキシサーバのホストが172.27.1.2の場合)。

(クライアント側)

```shell-session
$ curl https://google.com/ -x http://172.27.1.2:3128
```

HTTPSリクエストの場合、CONNECTメソッドでトンネリングができているかどうかヘッダを見て確認。サーバ側のログは以下の場所にある。

(サーバ側)

```shell-session
$ sudo less /var/log/squid/access.log
```


### SwitchyOmega

WindowsやMacのシステムのプロキシ設定を使うとDropboxやウィルス対策ソフトなど全ての通信がプロキシを経由してしまうので、SwitchyOmegaというChromeのアドオンをインストールしてブラウザで必要な時だけプロキシを経由するよう設定する。

https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif

サーバアドレスを手動で登録する、あるいはシステム管理者が公開しているpacファイルをインストールする。Switch Profileでホスト名などの条件に合致する場合自動的にプロキシを経由する設定にもできる。
