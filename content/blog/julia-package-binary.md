---
title: C/C++のライブラリをJuliaのパッケージとして登録する(Julia 1.3以降)
dateCreated: 2020-05-12
dateModified: 2020-05-25
tags:
  - Julialang
  - C
  - C++
  - Docker
  - package manager
  - package development
---

C/C++のライブラリを公開リポジトリに登録してJuliaのパッケージとして使用する方法です。BinaryBuilder.jlで設定ファイルを作成し、Yggdrasilを通じてJuliaBinaryWrappersにパッケージ登録します(Julia 1.3以降)。


### おおまかな流れ

1. C/C++ライブラリの準備
1. (Dockerがない場合)Dockerをインストール
1. BinaryBuilder.jlのインストール
1. build_tarballs.jlの作成
1. jllパッケージの動作確認
1. Yggdrasilにプルリクエストを送る

Juliaのバイナリパッケージの管理はYggdrasilとJuliaBinaryWrappersが担っています。

- Yggdrasil https://github.com/JuliaPackaging/Yggdrasil
- JuliaBinaryWrappers https://github.com/JuliaBinaryWrappers

Yggdrasilはビルド設定ファイル(build\_tarballs.jl)を管理しています。build\_tarballs.jlにはバイナリパッケージのビルドに必要な資源やビルド方法の情報が記載されています。Yggdrasilにこの設定ファイルのプルリクエストを送りマージされると、自動的にWindows、Mac OSX, Linuxなど各プラットフォームに対応したビルドレシピが生成され、JuliaBinaryWrappersのリポジトリにjllパッケージとして登録されます。jllパッケージは各環境に合わせてJuliaのパッケージとしてビルドされ、Juliaのデフォルトのパッケージ管理システム(Pkg.jl)で管理することができます。

### C/C++ライブラリの準備

Juliaパッケージにするライブラリのソースコードを入手し、ビルドできることを確認しておきます。

Cライブラリの場合は、Juliaから`ccall`関数で直接Cの関数を呼び出すことができます。C++は直接サポートされていないので、[Cxx.jl](https://github.com/JuliaInterop/Cxx.jl)もしくは[CxxWrap.jl](https://github.com/JuliaInterop/CxxWrap.jl)などのパッケージを利用するか、`extern "C"`でラッパーを作成して関数を`ccall`で呼び出せるようにしておきます。

Cxx.jlはマクロで直接JuliaのスクリプトにC++のコードが書けるので大変使いやすいですが、LLVM周りのアップデートが進まず、現状ではJulia本体のアップデートに追いついていません。


### Dockerのインストール

BinaryBuilder.jlはDocker上でクロスコンパイラの環境を構築し、各プラットフォームでのソースビルドをシミュレートします。

Mac OS Xの場合は[https://www.docker.com/](https://www.docker.com/)から最新版のDocker Desktopを入手します。Docker Desktopの.dmgファイルをダウンロードしてインストールし、起動しておきます(メニューバーにDockerのアイコンが表示され、クリックすると"Docker desktop is running"と表示されることを確認します)。


### BinaryBuilder.jlのインストール

JuliaのREPLを起動し、Pkgでインストールします。デフォルト環境で構いません。

```
(v1.3) pkg> add BinaryBuilder
```

BinaryBuilderをインポートして`run_wizard`を実行すると、ビルドレシピを作成するウィザードが立ち上がります。

```julia
using BinaryBuilder
BinaryBuilder.run_wizard()
```

```
o      `.
o*o      \'-_               00000000: 01111111  .
 \\      \;"".     ,;.--*  00000001: 01000101  E
  \\     ,\''--.--'/       00000003: 01001100  L
  :=\--<' `""  _   |       00000003: 01000110  F
  ||\\     `" / ''--       00000004: 00000010  .
  `/_\\,-|    |            00000005: 00000001  .
      \\/     L
       \\ ,'   \
     _/ L'   `  \          Join us in the #binarybuilder channel on the
    /  /    /   /          community slack: https://julialang.slack.com
   /  /    |    \
  "_''--_-''---__=;        https://github.com/JuliaPackaging/BinaryBuilder.jl

Welcome to the BinaryBuilder wizard.  We'll get you set up in no time.
```


### build_tarballs.jlの作成

BinaryBuilderのウィザードにしたがって、レシピファイル(build_tarballs.jl)を作成します。

まずビルドを行うプラットフォームを選択します。パッケージを公開する場合は全てのプラットフォームで利用できることが好ましいので、All Supported Platformsを選択します。ただし、全てのプラットフォームの環境をダウンロードするのにはかなりの時間を要します。時間が無い場合は、とりあえずSelect by Operating Systemを選択して自分の使用しているOSの環境を選択します。

```
  # Step 1: Select your platforms

Make a platform selection
> All Supported Platforms
Select by Operating System
Fully Custom Platform Choice
```

```
Select operating systems
[press: d=done, a=all, n=none]
 > [ ] FreeBSD
   [ ] Linux
   [ ] MacOS
   [ ] Windows
```

次に、ソースコードのgitリポジトリのURLを入力します。

```
# Step 2a: Obtain the source code

Please enter a URL (git repository or compressed archive) containing the source code to build:
> https://github.com/user/mylibrary.git
````

ビルドするコードのブランチ、コミットもしくはタグを入力します。

```
You have selected a git repository. Please enter a branch, commit or tag to use.
Please note that for reproducability, the exact commit will be recorded, 
so updates to the remote resource will not be used automatically; 
you will have to manually update the recorded commit.
> v1.0.0
```

追加で必要なリソースがあるかどうか聞いてきます。なければNで次に進みます。

```
Would you like to download additional sources?  [y/N]: 
```

他に依存するバイナリがあるかどうか聞いてきます。なければNで次に進みます。

```
# Step 2b: Obtain binary dependencies (if any)

Do you require any (binary) dependencies?  [y/N]: 
```

プロジェクト名を入力します。パッケージ名は[名前]_jll.jlになります。

```
Enter a name for this project.  This will be used for filenames:
> mylibrary
```

ビルドしたコードのバージョンを入力します。セマンティックバージョニング(例: v1.0.0)である必要がありますが、プレリリースやビルドメタデータがあるとエラーになるようです(例: v1.0.0-alpha.1, v1.0.0+2019.03)。

```
Enter a version number for this project:
> v1.0.0
```

コンパイラの設定をカスタマイズするかどうか聞かれます。

```
Do you want to customize the set of compilers? [y/N]: 
```

Linux環境のサンドボックスでテストビルドを行います。

```
# Step 3: Build for Linux(:x86_64, libc=:glibc)

You will now be dropped into the cross-compilation environment.
Please compile the package. Your initial compilation target is x86_64-linux-gnu
The $prefix environment variable contains the target directory.
Once you are done, exit by typing `exit` or `^D`

You have the following contents in your working directory:
- mylibrary
Hints:
- mylibrary/CMakeLists.txt

This file is likely input to CMake. The recommended options for CMake are

cmake -DCMAKE_INSTALL_PREFIX=$prefix -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TARGET_TOOLCHAIN} -DCMAKE_BUILD_TYPE=Release

followed by `make` and `make install`. Since the prefix environment
variable is set already, this will automatically perform the installation
into the correct directory.


mount: mounting overlay on /workspace/srcdir failed: Invalid argument
sandbox:${WORKSPACE}/srcdir # 
```

`${WORKSPACE}/srcdir`というディレクトリの下にソースコードのディレクトリがあるという設定になっています。ソースコードのルートディレクトリにMakefile等がある場合は、例えば下記のようなコマンドになります。ウィザードの説明文にあるように、`-DCMAKE_INSTALL_PREFIX`、`-DCMAKE_TOOLCHAIN_FILE`、`-DCMAKE_BUILD_TYPE`の3つのオプションを付与します。それ以外にライブラリ特有のオプションがあれば付与します。

```
cd mylibrary
cmake -DCMAKE_INSTALL_PREFIX=$prefix -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TARGET_TOOLCHAIN} -DCMAKE_BUILD_TYPE=Release
make -j${nproc}
make install
```

無事ビルドが成功したら、exitコマンドでログアウトします。

サンドボックスで打ったコマンドの履歴が表示されます(最初の行の`cd $WORKSPACE/srcdir`は自動的に追加されます)。コマンドの打ち間違いなどがあった場合は、ここでyを選択してスクリプトを修正します。

```
			Build complete

Your build script was:

	cd $WORKSPACE/srcdir
	cd $WORKSPACE/srcdir/mylibrary
	cmake -DCMAKE_INSTALL_PREFIX=$prefix -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TARGET_TOOLCHAIN} -DCMAKE_BUILD_TYPE=Release
	make -j${nproc}
	make install
	exit
	
Would you like to edit this script now? [y/N]: 
```

ビルドしたライブラリの名前を入力します。何もなければ生成されたライブラリファイルの名前と同じでいいと思います。複数のライブラリをビルドした場合はそれぞれに名前を付けます。

```

# Step 4: Select build products

The build has produced only one build artifact:

lib/libmylibrary.so.1.4.0

Please provide a unique variable name for each build artifact:
lib/libmylibrary.so.1.4.0:
> libmylibrary
```

Step1で複数のプラットフォームを指定した場合は、ここで他の仮想環境のインストールとテストビルドが行われます。ダウンロードにかなり時間がかかります。

```

# Step 5: Generalize the build script

We will now attempt to use the same script to build for other operating systems.
This will help iron out any issues with the cross compiler.
Your next build target will be x86_64-w64-mingw32
Press any key to continue...
```

最後にデプロイの方法を選択します。このままYggdrasilにプルリクエストを送るか、生成したbuild\_tarballs.jlのファイルを一旦ローカルに保存する(あるいは標準出力してコピペ)かを選べます。詳しくは後述しますが、build\_tarballs.jlの修正やパッケージの動作確認のために、一旦ファイルを出力することをお勧めします。

```

			# Step 7: Deployment

How should we deploy this build recipe?
 > Prepare a pull request against the community buildtree, Yggdrasil
   Write to a local file
   Print to stdout
```

Write to a local fileを選択し、ファイル名を入力します。

```
Enter path to build_tarballs.jl to write to:
> build_tar.jl
```

ファイルを書き出し、終了します。

```
Wizard Complete. Press any key to exit...
```

なお、build\_tarballs.jlは大変シンプルなスクリプトなので、ここまでに長いウィザードで設定してきた項目がbuild\_tarballs.jlのどこに記載されているかは簡単に理解できます。細かい変更については、再度ウィザードを起動するよりも、出力したbuild\_tarballs.jlを編集した方が速い場合もあると思います。


### jllパッケージの動作確認

いずれかの環境でビルドに問題がある場合は、下記のようにbuild_tarballs.jlをコマンドラインから実行することで、個々のプラットフォームについてビルドを検証することができます。

```
julia --color=yes build_tarballs.jl x86_64-apple-darwin14 --debug --verbose
```

- juliaコマンドのオプション`--color=yes`でビルドログがカラー出力されて見やすくなります。
- `build_tarballs.jl`の次の引数でプラットフォーム名をコンマ区切りで複数指定できます。省略すると全ての利用可能なプラットフォームでビルドを試みます(ダウンロードに時間がかかります)。
- `--debug`、`--verbose`オプションを付けるとビルドの詳細なログが出力されます。

生成されるjllパッケージの挙動については、ローカルでテストを完結する方法は現状ありません。`--deploy`オプションで自分のGitHubに一旦デプロイしてテストすることが可能です。

```
julia --color=yes build_tarballs.jl x86_64-apple-darwin14 --debug --verbose --deploy="myrepo/mylibrary_jll.jl"
```

GitHubのログイン情報を聞かれるので、入力するとリポジトリが作成されます。これで、Pkg.addによりjllパッケージをインストールできるようになります。

```
(v1.3) pkg> add https://github.com/myrepo/mylibrary_jll.jl.git
```

```
using mylibrary_jll

ccall((:myfunction, libmylibrary), Ptr{Cvoid}, ())
```


### Yggdrasilにプルリクエストを送る

Yggdrasilにプルリクエストを送るには以下の2つの方法があります。

1. BinaryBuilderのウィザードに従って自動でプルリクエストを送る

   ウィザードのStep 7で一番上の選択肢を選ぶことで、プルリクエストの作成に進みます。初めてパッケージを登録する際などは便利ですが、build\_tarballs.jlの細かい修正はできません。

1. Yggdrasilをフォークしてbuild\_tarballs.jlを設置し、手動でプルリクエストを送る

   バージョンアップ時の軽微な修正や、build\_tarballs.jlの詳細な編集が必要な場合は手動でプルリクエストを送ります。ソースコードの内容によっては、各プラットフォームでのビルド時にbuild\_tarballs.jlを編集するよう警告が出る場合があるので、その場合は手動での編集が必要になります(例えば、std::stringを使っているコードの互換性を保持するため、platformsに`expand_cxxstring_abis`を適用することを勧められるケースなど)。

どちらの場合も、プルリクエストを送ると自動的にCIのジョブが走り、各プラットフォーム環境でのビルドのテストが実施されます。その後、リポジトリのメンテナーによるレビューが行われ、問題が解決されるとYggdrasilにマージされます。Yggdrasilの次回のcronジョブでJuliaBinaryWrappersにjllパッケージが登録されます。
