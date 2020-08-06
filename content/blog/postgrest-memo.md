---
title: PostgRESTメモ
dateCreated: 2020-07-14
dateModified: 2020-07-14
tags:
  - PostgreSQL
  - REST API
---

### 環境

- MacOS 10.15.5
- Docker desktop 2.3.4.0


```
docker pull postgrest/postgrest
docker inspect -f "{{.Config.Env}}" postgrest/postgrest

postgrest.conf
db-uri       = "postgres://auth:pass@[クラスターIP]:5432/default"
db-schema    = "api"
db-anon-role = "web_anon"

docker run -v [postgrestの場所]/postgrest/postgrest.conf:/etc/postgrest.conf -p 3000:3000 postgrest/postgrest
```
