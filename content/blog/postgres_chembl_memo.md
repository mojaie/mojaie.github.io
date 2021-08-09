---
title: ChEMBLのPostgreSQLへの取り込みメモ
dateCreated: 2021-08-09
dateModified: 2021-08-09
tags:
  - PostgreSQL
  - Docker
  - ChEMBL
---

### 環境

- MacOS: 11.5
- Docker Desktop: 3.5.2
- PostgreSQL: 13.3
- ChEMBL: 29


### ChEMBLダウンロード

Downloads  
https://chembl.gitbook.io/chembl-interface-documentation/downloads

公式のPostgreSQL dmpファイルをダウンロードして解凍、適当なresourceフォルダに設置。


### データベースの作成

Postgresはdocker-composeで設定済み。volumesにresourceフォルダを指定。

```
version: '3'
services:
  db:
    image: postgres
    container_name: PostgreSQL
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: default
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres-passwd
    volumes:
      - ./postgres:/docker-entrypoint-initdb.d
      - ./postgres/data:/var/lib/postgresql/data
      - ./resources:/resources
    secrets:
      - postgres-passwd
...
```


```
docker-compose up -d
```

postgresコンテナにログインしてCLIを開く。psqlログイン。

```
psql -U postgres
```

ChEMBLダウンロードファイルのインストラクションに従ってcreate database

```
postgres=# create database chembl_29;
```

`\l`でDBのリストが確認できる。chembl_29ができていれば`\q`で終了。

リストアコマンドを入力

```
pg_restore --no-owner -U postgres -d chembl_29 ./resources/chembl_29_postgresql/chembl_29_postgresql.dmp
```

・・・

・・・

・・・

かなり時間がかかるのでやめた。一旦dropして再度create。

```
postgres=# drop database chembl_29;
postgres=# create database chembl_29;
```


### 必要なテーブルだけをリストアする

実は必要なテーブルは2つだけだったので、必要なテーブルだけをrestoreすることにした。
`-t`コマンドで特定のテーブルのみをリストアできるが、テーブル名が間違っているのかリストアできてなかった。

一旦`-l`コマンドでdumpの中身を確認したら、どうもドキュメントのスキーマ一覧ではテーブル名は大文字表記なのに、実際には小文字だったようだ。あらためて`-t`でリストアされるテーブルを確認する。

```
pg_restore -l -t structural_alerts ./resources/chembl_29_postgresql/chembl_29_postgresql.dmp
```

出力:

```
...(省略)...
;
; Selected TOC Entries:
;
236; 1259 194809 TABLE public structural_alerts user
3124; 0 194809 TABLE DATA public structural_alerts user
```

今度はTOC Entriesが表示されているので大丈夫そうである。気を取り直してpg_restoreする。`--no-owner`を付けると元のデータベースの権限を無視してリストアしたユーザが所有者になる。

```
pg_restore --no-owner -U postgres -d chembl_29 -t structural_alerts ./resources/chembl_29_postgresql/chembl_29_postgresql.dmp
pg_restore --no-owner -U postgres -d chembl_29 -t structural_alert_sets ./resources/chembl_29_postgresql/chembl_29_postgresql.dmp
```

2つとも非常に小さいテーブルなのですぐにリストアが完了する。内容を確認する。

```
psql -U postgres -d chembl_29
chembl_29=# select * from structural_alerts;
```

出力:

```
...(省略)...
        1 |            1 | R1 Reactive alkyl halides                    | [Br,Cl,I][CX4;CH,CH2]
        2 |            1 | R2 Acid halides                              | [S,C](=[O,S])[F,Br,Cl,I]
        3 |            1 | R3 Carbazides                                | O=CN=[N+]=[N-]
```

問題なさそうである。