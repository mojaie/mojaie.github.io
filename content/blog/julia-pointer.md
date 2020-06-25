---
title: Juliaの参照とポインタのメモ
dateCreated: 2020-06-23
dateModified: 2020-06-23
tags:
  - Julialang
  - C
  - C++
---

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
