---
title: GenieとPostgreSQLでREST APIサーバを構築
dateCreated: 2020-07-09
dateModified: 2020-07-09
tags:
  - Julia
  - PostgreSQL
---


PostgreSQLのデータベースは予め作成しておく必要がある。


### GenieとSearchLight(ORM)のインストール

```
pkg> add Genie
pkg> add SearchLight
pkg> add SearchLightPostgress
```


### 起動スクリプト

シンプルなAPIのバックエンドの例
https://geniejl.readthedocs.io/en/latest/guides/Simple_API_backend/

```julia
using Genie
import Genie.Router: route
import Genie.Renderer.Json: json

Genie.config.run_as_server = true

route("/") do
  (:message => "Hi there!") |> json
end

Genie.startup()
```

これだけ。コマンドラインから上記スクリプトを実行するだけでGETリクエストに対してJSONレスポンスを返すサーバが起動する。



### SearchLightによるデータベースのセットアップ

https://geniejl.readthedocs.io/en/latest/guides/Working_With_Genie_Apps/#accessing-databases-with-seachlight-models

```
julia> using Genie
[ Info: Precompiling Genie [c43c736e-a2d1-11e8-161f-af95117fbd1e]

julia> Genie.Generator.db_support()
```

IO Errorになるが、dbフォルダとconnection.ymlが生成されている。
(7/9時点) バグがあり、Generatorで生成したファイルにwrite permissionが無いようだ。手動で修正する必要がある。  
https://github.com/GenieFramework/Genie.jl/issues/157

connection.ymlを編集してDB接続情報を入力する。


### DB設定の読み込み

```
julia> SearchLight.Configuration.load()
Dict{String,Any} with 8 entries:
  "options"  => Dict{String,String}()
  "host"     => "localhost"
  "password" => "password"
  "config"   => nothing
  "username" => "pguser"
  "port"     => 5432
  "database" => "default"
  "adapter"  => "PostgreSQL"
```


### DB接続

```
julia> SearchLight.Configuration.load() |> SearchLight.connect
PostgreSQL connection (CONNECTION_OK) with parameters:
  user = pguser
  password = ********************
  dbname = default
  host = localhost
  port = 5432
  client_encoding = UTF8
  options = -c DateStyle=ISO,YMD -c IntervalStyle=iso_8601 -c TimeZone=UTC
  application_name = LibPQ.jl
  sslmode = prefer
  sslcompression = 0
  gssencmode = disable
  krbsrvname = postgres
  target_session_attrs = any
```

`SearchLightPostgreSQL.CONNECTIONS`に現在接続中のDBの情報が配列として格納されている。


### クエリ実行

julia> SearchLight.query("SELECT * FROM substances")
[ Info: SELECT * FROM substances
  0.351419 seconds (107.96 k allocations: 5.602 MiB, 6.16% gc time)
2327×2 DataFrames.DataFrame
│ Row  │ id           │ origin      │
│      │ String⍰      │ String⍰     │
├──────┼──────────────┼─────────────┤
│ 1    │ DB0000000001 │ DrugBankFDA │
│ 2    │ DB0000000002 │ DrugBankFDA │
│ 3    │ DB0000000003 │ DrugBankFDA │
│ 4    │ DB0000000004 │ DrugBankFDA │
│ 5    │ DB0000000005 │ DrugBankFDA │
│ 6    │ DB0000000006 │ DrugBankFDA │
⋮
│ 2321 │ DB0000002321 │ DrugBankFDA │
│ 2322 │ DB0000002322 │ DrugBankFDA │
│ 2323 │ DB0000002323 │ DrugBankFDA │
│ 2324 │ DB0000002324 │ DrugBankFDA │
│ 2325 │ DB0000002325 │ DrugBankFDA │
│ 2326 │ DB0000002326 │ DrugBankFDA │
│ 2327 │ DB0000002327 │ DrugBankFDA │


# モデルの作成

julia> SearchLight.Generator.newresource("Substance")
[ Info: New model created at /Users/smatsuoka/Workspace/apiserver/app/resources/substances/Substances.jl
[ Info: New table migration created at /Users/smatsuoka/Workspace/apiserver/db/migrations/2020070912544364_create_table_substances.jl
[ Info: New validator created at /Users/smatsuoka/Workspace/apiserver/app/resources/substances/SubstancesValidator.jl
[ Info: New unit test created at /Users/smatsuoka/Workspace/apiserver/test/substances_test.jl


モデル、マイグレーションスクリプト、バリデーター、ユニットテストのファイルが生成される。
