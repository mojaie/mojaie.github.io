---
title: SSHリモートでUbuntu20.04にアップグレードした際のメモ
dateCreated: 2020-08-15
dateModified: 2020-08-15
tags:
  - SSH
  - Ubuntu
  - remote
  - environment setup
---

在宅なのでリモートでアップデートしました。あまり推奨はされないらしいです。

How to upgrade from Ubuntu 18.04 LTS to 20.04 LTS today 
https://ubuntu.com/blog/how-to-upgrade-from-ubuntu-18-04-lts-to-20-04-lts-today

`do-release-upgrade`コマンドを使用します。-dオプションはdevelopmentリリースのインストールを指定しますが、2020/8/15時点で必須のようです(通常新リリースから3ヶ月くらい経つと普通にインストールできるようになるらしい)。旧バージョンがdesktopであればdesktop、serverであればserverの新バージョンがデフォルトでインストールされます。modeオプションでdesktopかserverを変更することが可能です。

```shell-session
$ sudo do-release-upgrade -d
新しい Ubuntu のリリースをチェックしています
Please install all available updates for your release before upgrading.
```

利用可能なアップデートは全てインストールしろと言われるのでします。

```shell-session
$ sudo apt update
$ sudo apt upgrade
$ sudo apt dist-upgrade
```

dist-upgradeのときにautoremoveしろといわれるのでします。

```shell-session
$ sudo apt autoremove
```

`do-release-upgrade`再チャレンジ。

```shell-session
$ sudo do-release-upgrade -d
新しい Ubuntu のリリースをチェックしています
You have not rebooted after updating a package which requires a reboot. Please reboot before upgrading.
```

再起動しろと言われるのでします。

```shell-session
$ sudo reboot
```

再起動したらSSH再接続して`do-release-upgrade`します。

```shell-session
$ sudo do-release-upgrade -d
[sudo] server のパスワード: 
新しい Ubuntu のリリースをチェックしています
0% [作業中]
0% [jp.archive.ubuntu.com へ接続しています]
0% [jp.archive.ubuntu.com (160.26.2.187) へ接続しています]
0% [ヘッダの待機中です]

...

取得:1 ツールの署名のアップグレード [1,554 B]
99% [ヘッダの待機中です]
取得:2 ツールのアップグレード [1,348 kB]
100% [作業中]
1,350 kバイト/0秒 を取得しました (0 B/秒)
「focal.tar.gz.gpg」を用いて「focal.tar.gz」の認証を行ないます
'focal.tar.gz' の展開中

キャッシュを読み込み中

パッケージマネージャーをチェック中です

SSH経由で実行していますが、続けますか？


このセッションはSSH上で実行されているようです。アップグレードをSSH越しに行うことは推奨されません。アップグレードに失敗した時の復元が困難になるからです。

続行する場合、追加のSSHデーモンをポート '1022' で起動します。 
本当に作業を進めてよろしいですか？ 

続行する[yN]
```

SSHでのアップデートは推奨されないようです。構わずyを押します。

```shell-session
予備のsshdを開始します 

障害が起こったときに復旧しやすくするため、ポート '1022' でもう一つの sshd 
を開始します。現在実行中のsshにおかしなことが起きても、もう一方のポートに接続することができます。 

ファイアウォールを実行している場合、このポートを一時的に開く必要があります。この操作は、潜在的な危険があるため自動的には行われません。以下の例のようにしてポートを開けます: 
'iptables -I INPUT -p tcp --dport 1022 -j ACCEPT' 

続けるには [ENTER] キーを押してください
```

続けます。ENTERです。

```shell-session
パッケージリストを読み込んでいます... 完了  
依存関係ツリーを作成しています           
状態情報を読み取っています... 完了      
0% [作業中]
0% [作業中]
0% [jp.archive.ubuntu.com へ接続しています]
0% [jp.archive.ubuntu.com へ接続しています]

...

100% [作業中]
52.5 Mバイト/0秒 を取得しました (0 B/秒)

パッケージマネージャーをチェック中です
パッケージリストを読み込んでいます... 完了
依存関係ツリーを作成しています
状態情報を読み取っています... 完了

変更点を確認中

変更点を確認中

アップグレードを開始しますか？


14 個のインストール済みパッケージは Canonical
によってサポートされなくなりました。ただしコミュニティからのサポートは受けることができます。

50 個のパッケージが削除されます。 356 個の新規パッケージがインストールされます。 1859
個のパッケージがアップグレードされます。

合計 1,388 M をダウンロードする必要があります。 このダウンロードは 1Mbit DSL 接続で約 2 時間 56 分、56kモデムで約 2 日 5 時間 かかります。

アップグレードの取得とインストールには数時間かかることがあります。ダウンロードが完了してしまうと、処理はキャンセルできません。

 続行する[yN]  詳細 [d]
```

ダウンロードに時間がかかるようです。回線環境を確認してyします。

```shell-session
取得中
0% [作業中]
0% [作業中]

...

設定ファイル '/etc/squid/squid.conf'
 ==> これはインストールしてから (あなたかスクリプトによって) 変更されています。
 ==> パッケージ配布元が更新版を提供しています。
   どうしますか? 以下の選択肢があります:
    Y か I  : パッケージメンテナのバージョンをインストールする
    N か O  : 現在インストールされている自分のバージョンを残す
      D     : 両バージョンの差異を表示する
      Z     : 状況を調査するためにシェルを開始する
 デフォルトでは現在使っている自分のバージョンを残します。
*** squid.conf (Y/I/N/O/D/Z) [デフォルト=N] ? 
```

寝ている間に完了するかと思っていたら、途中でsquidどうする？と聞かれたまま止まってました。この間にVPSがタイムアウトしてしまったので痛恨のssh切断。

再度sshログインしてアップデートを試みます。既に20.04にはなっていますが、必要なファイルの設定が済んでいません。

```shell-session
$ sudo apt dist-upgrade
[sudo] server のパスワード: 
Waiting for cache lock: Could not get lock /var/lib/dpkg/lock. It is held by pro
```

強制シャットダウンしたのでロックがかかったままになっています。ask-ubuntuで見たあらゆるロックファイルを消してみます。

```shell-session
$ sudo rm /var/lib/apt/lists/lock
$ sudo rm /var/cache/apt/archives/lock
$ sudo rm /var/lib/dpkg/lock
```

```shell-session
$ sudo apt dist-upgrade
E: dpkg は中断されました。問題を修正するには 'sudo dpkg --configure -a' を手動で実行する必要があります。
```

どうやらアップデート途中から再開できるようです。

```shell-session
$ sudo dpkg --configure -a
squid (4.10-1ubuntu1.1) を設定しています ...

設定ファイル '/etc/squid/squid.conf'
 ==> これはインストールしてから (あなたかスクリプトによって) 変更されています。
 ==> パッケージ配布元が更新版を提供しています。
   どうしますか? 以下の選択肢があります:
    Y か I  : パッケージメンテナのバージョンをインストールする
    N か O  : 現在インストールされている自分のバージョンを残す
      D     : 両バージョンの差異を表示する
      Z     : 状況を調査するためにシェルを開始する
 デフォルトでは現在使っている自分のバージョンを残します。
*** squid.conf (Y/I/N/O/D/Z) [デフォルト=N] ? 
```

戻ってこれました。回答してインストールを続けます。パッケージをアップデートします。

```shell-session
$ sudo apt dist-upgrade
$ sudo apt autoremove
```

これで完了です。
