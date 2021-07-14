---
title: GROWI導入メモ
dateCreated: 2020-06-20
dateModified: 2020-06-20
tags:
  - GROWI
  - Docker
  - Ubuntu
---

### 環境

- サーバ: Ubuntu 20.04.1 LTS
  - Docker 20.10.1


### インストール

ほぼ公式ドキュメントに沿ってインストール

GROWI Docs  
https://docs.growi.org/ja/

```
git clone https://github.com/weseek/growi-docker-compose.git growi
```

docker-composeの設定を確認しておく。デフォルトのポート3000はPostgRESTと重複なので変更した。

```
docker-compose up -d
```


-dオプションで起動してサーバにアクセス、あとはドキュメントに沿ってサイトURLなどを設定。