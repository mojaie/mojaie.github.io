---
title: Juliaのパッケージをコンパイルして共有ライブラリを作成する
dateCreated: 2020-08-08
dateModified: 2020-08-16
tags:
  - Julia
  - package development
---

PackageCompilerでJuliaのパッケージをコンパイルして共有ライブラリを作成します。

参考:
https://julialang.github.io/PackageCompiler.jl/dev/


### パッケージをコンパイルする目的

1. JITコンパイルの待ち時間を無くす

   Juliaはusingやimportされた関数が初めて実行される際にコンパイルを行うため、Jupyter notebook等でセッションを開始するごとに汎用的な関数がコンパイルされる事は大変なストレスになります。そこで、予め頻繁に使用するモジュール(例えばPlot.jl)がプレコンパイルされたシステムイメージを作成し、デフォルトイメージとして使用する事でJITコンパイルを避けることができます。

1. Juliaのプログラムを他の言語のプログラムから呼び出せるようにする

   拡張子.soのライブラリファイル(MacOSでは.dylib)を作成することで、C言語あるいはPythonのctypesライブラリからJuliaの関数を呼び出すことができます。もちろん、Juliaのccallでも呼び出すことが可能です。作成したライブラリはJulia1.3以降のArtifactシステムを利用することで、環境に左右されずに様々なプラットフォームで利用することができます。

1. 実行可能なJuliaのプログラムを配布する

   上記と同様の方法で、実行可能なバイナリを作成することもできます。Artifactシステムを利用して各プラットフォームで実行可能なアプリケーションを作成し、配布することが容易になります。また、Dockerコンテナに実行可能なアプリケーションを配置し、Kubernetes等のパイプラインに組み込むことも可能です。


### 環境

- Julia 1.5.0


### Juliaのパッケージを共有ライブラリにする

公式リポジトリに登録可能な形式で作成されたパッケージを作成します(あるいは、利用したい公式リポジトリのパッケージをインストールします)。

単にシステムイメージや実行可能バイナリを作成したい場合はそのままで問題ありませんが、他言語から呼び出し可能な共有ライブラリを作成する場合は、exposeする関数に`@ccallable`マクロを設定します。

下記に、執筆者の作成したMolecularGraph.jlというライブラリのインターフェースである、MolecularGraphCInterface.jlというパッケージの例を示します。引数と返り値はC言語に互換性のある型である必要があります。


```julia

module MolecularGraphCInterface

using MolecularGraph


Base.@ccallable function getmw(smiles::Ptr{UInt8})::Cdouble
    return try
        mol = smilestomol(unsafe_string(smiles))
        precalculate!(mol)
        standardweight(Float64, mol)
    catch
        Base.invokelatest(Base.display_error, Base.catch_stack())
        nothing
    end
end

Base.@ccallable function getstruct(smiles::Ptr{UInt8})::Ptr{UInt8}
    return try
        mol = smilestomol(unsafe_string(smiles))
        precalculate!(mol)
        pointer(drawsvg(mol, 200, 200))
    catch
        Base.invokelatest(Base.display_error, Base.catch_stack())
        nothing
    end
end

if abspath(PROGRAM_FILE) == @__FILE__
    teststr = "CC1=C2[C@@]([C@]([C@H]([C@@H]3[C@]4([C@H](OC4)C[C@@H]([C@]3(C(=O)[C@@H]2OC(=O)C)C)O)OC(=O)C)OC(=O)c5ccccc5)(C[C@@H]1OC(=O)[C@H](O)[C@@H](NC(=O)c6ccccc6)c7ccccc7)O)(C)C"
    println(getmw(pointer(teststr)))
    println(unsafe_string(getstruct(pointer(teststr))))
end

end # module
```

モジュールのテストを実行し、動作を確認します。



### 全自動でコンパイル

基本的には`create_sysimage`を呼び出すだけで必要な機能が全てコンパイルされた共有ライブラリが作成できます。

```julia
using PackageCompiler
create_sysimage(;sysimage_path="libmgcint.dylib", incremental=false, script="MolecularGraphCInterface.jl")
```

ccall関数を使ってJuliaから呼び出せるかどうか確認します。

```julia
using Libdl
libmg = dlopen("libmgcint.dylib")
getmw = dlsym(libmg, :getmw)
mol = "CC1=C2[C@@]([C@]([C@H]([C@@H]3[C@]4([C@H](OC4)C[C@@H]([C@]3(C(=O)[C@@H]2OC(=O)C)C)O)OC(=O)C)OC(=O)c5ccccc5)(C[C@@H]1OC(=O)[C@H](O)[C@@H](NC(=O)c6ccccc6)c7ccccc7)O)(C)C"
ccall(getmw, Cdouble, (Cstring,), mol)
```


### 手動でコンパイル

コンパイルしたい関数を選びたい場合など、手動でコンパイルすることも可能です。

1. --trace-compileでコンパイル情報を追跡記録
1. --output-oで上記記録をもとにオブジェクトファイルを作成
1. プラットフォーム依存のlibjuliaビルドオプションを確認する
1. libjuliaビルドオプションを参考にライブラリをビルド


--trace-compileオプションで指定したパスに、juliaのスクリプトが実行された際に行われたコンパイルを追跡して記録したファイルが生成されます。この情報をもとにコンパイルすることで、このスクリプトを実行するために必要なオブジェクトだけがコンパイルされたバイナリを作成することができます。

```shell-session
$ cd project_dir
$ julia --project=. --trace-compile=app_precompile.jl src/MolecularGraphCInterface.jl
```

--output-oオプションで生成する.oファイルのパスを指定し、custom_sysimage.jlというスクリプトを実行します。custom_sysimage.jlは下記公式チュートリアルに例があります。
https://julialang.github.io/PackageCompiler.jl/dev/devdocs/binaries_part_2/

```shell-session
$ mkdir build
$ julia --project=. -J"/Applications/Julia-1.5.app/Contents/Resources/julia/lib/julia/sys.dylib" --output-o build/sys.o custom_sysimage.jl
```

プラットフォームごとにJuliaのライブラリのビルドに必要なCコンパイラのフラッグは異なるので、Juliaアプリケーション自体をビルドした際の情報をもとにビルドを行います。Juliaアプリケーションのshareフォルダにあるjulia-config.jlを実行すると、Julia自体のコア機能を担う共有ライブラリlibjuliaをビルドした際のビルドオプションを確認できます。

```shell-session
$ /Applications/Julia-1.5.app/Contents/Resources/julia/share/julia/julia-config.jl --cflags --ldflags --ldlibs

-std=gnu99 -I'/Applications/Julia-1.5.app/Contents/Resources/julia/include/julia' -fPIC
-L'/Applications/Julia-1.5.app/Contents/Resources/julia/lib'
-Wl,-rpath,'/Applications/Julia-1.5.app/Contents/Resources/julia/lib' -ljulia
```

gccでオブジェクトファイルをコンパイルします。以下MacOSと一般的なLinuxの例です。同じOSでもバージョンによってビルドオプションが異なる場合があるので、必ずjulia-config.jlで自身の環境のビルドオプションを確認することが重要です。

MacOS

```shell-session
$ cd build
$ gcc -shared -o libmgcint.dylib -Wl,-all_load sys.o -std=gnu99 -I'/Applications/Julia-1.5.app/Contents/Resources/julia/include/julia' -fPIC -L"/Applications/Julia-1.5.app/Contents/Resources/julia/lib" -Wl,-rpath,'/Applications/Julia-1.5.app/Contents/Resources/julia/lib' -ljulia
```

Linux

```shell-session
$ cd build
$ gcc -shared -o libmgcint.dylib -fPIC -Wl,--whole-archive sys.o -Wl,--no-whole-archive -L"/Applications/Julia-1.5.app/Contents/Resources/julia/lib" -ljulia
```

ビルドに成功すると.dylibもしくは.soファイルが生成されます。
