---
title: VPN経由でDocker compose upするとサーバに接続できなくなった
dateCreated: 2022-01-06
dateModified: 2022-01-06
tags:
  - Docker
  - SSH
  - VPN
  - network
  - remote
---

### 環境

- クライアント: MacOS 11.6.1
  - F5 VPN
- サーバ: Ubuntu 20.04.3 LTS
  - Docker Engine 20.10.12
  - Docker Compose 1.25.0


### 構成

- 自宅MacからVPNで職場のネットワークにあるサーバに接続
- サーバはPostgreSQLでデータベースを構築してあり、Docker-composeでPostgreSQLとPostgRESTを起動し、自宅からHTTP接続でデータを取得している


### 現象

docker-compose upしたらエラーになり、その後一切SSHでサーバに接続できなくなった


### 原因

ネットワーク障害かと思って情シスに問い合わせたところ、特に異常はないとのこと。サーバ側でクライアントを遮断しているのでは?sshdのログやiptablesを確認してみてねとのこと。

出勤して職場内の別の端末からサーバにSSH接続すると普通に接続できた。言われた通りiptablesを確認してみると、Chain DOCKERのdestinationが172.31.0.2になっているレコードあり。なんだこれは。

```
(server) user@hogehoge:~$ docker network ls
NETWORK ID     NAME             DRIVER    SCOPE
bd6daba0ee1d   bridge           bridge    local
64ed5ca6e3c3   host             host      local
53fd71b61b86   none             null      local
8888ff4c812c   server_default   bridge    local
```

Docker-composeは自動的にプロジェクト名_defaultというネットワークを作成して各コンテナに空いているIPを割り当てるらしい。docker network inspectするとネットワークの詳細が確認できる。

```
(server) user@hogehoge:~$ docker network inspect 8888ff4c812c
[
    {
        "Name": "server_default",
        (中略)
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.31.0.0/16",
                    "Gateway": "172.31.0.1"
                }
            ]
        },
        (中略)
    }
]
```

Subnetで172.31.0.0/16の範囲が割り当てられている。これが原因のような気がするので`docker network rm`で削除して帰宅。

```
(server) user@hogehoge:~$ docker network rm 8888ff4c812c
8888ff4c812c
```

自宅から再度VPN経由でSSH接続してみると普通につながる。やはりDocker networkが原因だったようだ。VPNの設定のルーティングテーブルを見てみると職場内ネットワークIPへのアクセスを172.31.30.49に回す設定になっているので、IPアドレスが競合しているようだ...


### 対策

Composeファイルで明示的にネットワークを指定する。

参考: Compose file version 3 referenceのipv4\_address, ipv6\_addressあたり
https://docs.docker.com/compose/compose-file/compose-file-v3/

```
version: "3.7"

services:
  app1:
    image: image1
    networks:
      network1:
        ipv4_address: 172.233.0.2
  app2:
    image: image2
    networks:
      network1:
        ipv4_address: 172.233.0.3

networks:
  network1:
    ipam:
      driver: default
      config:
        - subnet: "172.233.0.0/16"
```

トップレベル要素のnetworksの下にネットワーク名(例ではnetwork1)、その下のipam、configで、VPNとかぶらないサブネットの範囲を指定する。さらに、servicesの下のそれぞれのサービスにnetworks要素を作成し、ネットワーク名、ipv4_addressで先程のサブネット内のアドレスを指定する。ゲートウェイを指定しない場合、範囲の先頭のアドレス(例では172.233.0.1)が自動的にゲートウェイに割り当てられるので、それ以外のアドレスにする。
