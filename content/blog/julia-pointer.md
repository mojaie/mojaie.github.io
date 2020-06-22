---
title: Juliaの参照とポインタ
dateCreated: 2020-06-23
dateModified: 2020-06-23
tags:
  - Julialang
  - C
  - C++
draft: true
---

### Ref{T}とPtr{T}

RefもPtrもメモリアドレスを指し示す値を格納するオブジェクトの型ですが、それぞれC++における参照とポインタの概念に近いと思われます。

Refによる参照は`Ref(x)`のように作成します。参照先のオブジェクトの取得(デリファレンス)は`[]`で行います。Refは必ずJuliaのオブジェクトが格納された有効なアドレスを示すので、Ptrより安全です。

Ptrを使うのは特にJuliaからCのライブラリを呼び出す際にC側のAPIでポインタが必要な場合です。pointer関数で作成します。アドレスがNULLを指すこともあり安全ではないので、デリファレンスの関数は`unsafe_load`、`unsafe_string`のようになっています。`C_NULL`でNULLを指すポインタを作成することもできます。

PtrはRefのサブタイプです。

```
julia> Ptr <: Ref
true
```
