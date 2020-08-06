---
title: Juliaの開発Tips
dateCreated: 2020-06-23
dateModified: 2020-08-03
tags:
  - Julialang
---


Juliaのパッケージ開発に関する小ネタ集。
増えてきたらそれぞれ個別記事を作成予定。


### Ref{T}とPtr{T}

- RefもPtrもメモリアドレスを指し示す値を格納するオブジェクトの型
- それぞれC++における参照とポインタの概念に近い?
- Ref
  - Refによる参照は`Ref(x)`で作成
  - 参照先のオブジェクトの取得(デリファレンス)は`[]`
  - Refは必ずJuliaのオブジェクトが格納された有効なアドレスを示すので、Ptrより安全
  - 単に参照を使いたい場合はRefの方がいい
- Ptr
  - Ptrを使うのは特にCやC++のライブラリAPIがポインタ渡しを要求する場合
  - `pointer(x)`で作成
  - Refと異なりアドレスがNULLを指すことがあるので安全ではない
  - デリファレンスの関数は`unsafe_load`、`unsafe_string`など、unsafeが付く
- PtrはRefのサブタイプ(`Ptr <: Ref`はtrue)


### 開発中のパッケージのリロード

dev



### Revise.jl

edit(function)
マクロとかを使ってると機能しない

ライブラリの再読み込みの場合は
Revise.track(MolecularGraph)
マクロも行けるのでパッケージ開発のばあいはこっちの方が無難



### Benchmark.jl




### メタプロ

- Exprの作り方
  - シンボル:()
  - quoteブロック
  - Meta.parseでstringから
- Exprの評価はeval()


内挿とエスケープ

マクロ





### イテレータ関連

#### maxとかが空の配列の時エラーになる

```
reduce(+, values(b), init=0)
```

#### minやmaxのソート順を固定する

```julia
function sortstablemax(iter; by=identity, kwargs...)
    cmp(x, y) = by(x) < by(y) ? y : x
    return reduce(cmp, iter; kwargs...)
end


function sortstablemin(iter; by=identity, kwargs...)
    cmp(x, y) = by(x) > by(y) ? y : x
    return reduce(cmp, iter; kwargs...)
end
```


#### DictとSet

Juliaではコンテナ型の種類に関わらず`in`や`intersection`、`union`などが使えてしまうので注意が必要。


### Array

- `in` によるルックアップや`intersection`、`union`など集合関連の操作も可能だが、遅い。
- 要素の順序にしたがって連続的にメモリが確保されており、ブロードキャストが高速


### DictとSet

- SetはDictを使って実装されている(Set{T}の中身はDict{T,Nothing})。
- keys(dict)はBase.KeySetというAbstractSetのサブクラスのオブジェクトを返す
- 一方values(dist)はBase.ValueIteratorというただのイテレータを返す
- DictのキーとSetはハッシュマップで実装されているので、`in`がO(1)、集合関連の関数が速い。
- ブロードキャストは遅い
- indexが必要な操作ができない
- オブジェクト生成のオーバーヘッドがArrayより大きい?


### 検証コード

```
a = 1:2:1000000
b = 1:3:1000000

@time　aarr = collect(a)
@time　aset = Set(a)
@time　barr = collect(a)
@time　bset = Set(a)
@time intersect(aset, bset)
@time union(aset, bset)
@time 777777 in aset
@time abs.(aset)
@time [abs(e) for e in aset]
```
